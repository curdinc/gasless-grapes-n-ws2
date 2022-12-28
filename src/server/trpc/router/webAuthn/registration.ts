import { AUTH_COOKIE_NAME } from "@server/common/get-server-auth-session";
import { DeviceAuthenticator } from "@server/db/modals/DeviceAuthenticator";
import { User } from "@server/db/modals/User";
import { UserChallenge } from "@server/db/modals/UserChallenge";
import { publicProcedure } from "@server/trpc/trpc";
import type { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { TRPCError } from "@trpc/server";
import { jwtCookie } from "@utils/jwtCookie";
import { ErrorMessages } from "@utils/messages";
import { WebAuthnUtils } from "@utils/webAuthn";
import * as crypto from "crypto";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import { TransportSchema } from "types/schema/WebAuthn/common";
import { RegisterCredentialSchema } from "types/schema/WebAuthn/RegistrationCredentialSchema";
import { z } from "zod";
import {
  ECDSA_W_SHA256_ALG,
  TWO_MINUTE_IN_MILLISECONDS,
  WEB_AUTHN_CURRENT_RP_ID,
  WEB_AUTHN_RP_ID,
  WEB_AUTHN_RP_NAME,
  WEB_AUTHN_RP_ORIGIN,
} from ".";

export const webAuthnRegistrationProcedures = {
  getRegistrationOptions: publicProcedure
    .input(
      z.object({
        deviceName: z
          .string()
          .max(64, { message: ErrorMessages.maxUsernameLength }),
        email: z.string().email().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = crypto.randomUUID();
      const user = await User().maybeCreateUserForRegistration({
        userId,
        email: input.email,
      });
      const options = generateRegistrationOptions({
        rpName: WEB_AUTHN_RP_NAME,
        rpID: WEB_AUTHN_CURRENT_RP_ID,
        userID: user.id,
        userName: input.deviceName,
        attestationType: "direct",
        // Prevent users from re-registering existing authenticators
        excludeCredentials: user.authenticators.map((authenticator) => ({
          id: Buffer.from(authenticator.credentialId, "hex"),
          type: "public-key",
          transports: TransportSchema.parse(authenticator.transports),
        })),
        timeout: TWO_MINUTE_IN_MILLISECONDS,
        authenticatorSelection: {
          residentKey: "required",
          requireResidentKey: true,
          userVerification: "preferred",
          authenticatorAttachment: "platform",
        },
        supportedAlgorithmIDs: [ECDSA_W_SHA256_ALG],
        extensions: {
          credProps: true,
          uvm: true,
        },
      });

      console.log("options", options);
      if (!(await UserChallenge().set(userId, options.challenge))) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
        currentDeviceName: input.deviceName,
        id: user.id,
        state: "pendingRegistration",
      });

      return options;
    }),
  verifyRegistration: publicProcedure
    .input(RegisterCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const challenge = await UserChallenge().get(user?.id || "");
      if (!ctx.session || !user || !challenge) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      let verification: VerifiedRegistrationResponse;
      try {
        verification = await verifyRegistrationResponse({
          credential: input,
          expectedChallenge: challenge,
          expectedOrigin: WEB_AUTHN_RP_ORIGIN,
          expectedRPID: WEB_AUTHN_RP_ID,
          requireUserVerification: true,
          supportedAlgorithmIDs: [ECDSA_W_SHA256_ALG],
        });
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const { verified, registrationInfo } = verification;
      if (!registrationInfo) {
        return { verified };
      }

      await DeviceAuthenticator().saveNewAuthenticator({
        counter: registrationInfo.counter,
        credentialBackedUp: registrationInfo.credentialBackedUp,
        credentialDeviceType: registrationInfo.credentialDeviceType,
        credentialId: WebAuthnUtils.bufferToHexString(
          registrationInfo.credentialID
        ),
        credentialPublicKey: WebAuthnUtils.bufferToHexString(
          registrationInfo.credentialPublicKey
        ),
        deviceName: user.currentDeviceName,
        rawAttestation: input.response.attestationObject,
        transports: input.transports,
        userId: user.id,
      });

      await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
        currentDeviceName: user.currentDeviceName,
        id: user.id,
        state: "loggedIn",
      });
      return { verified };
    }),
};
