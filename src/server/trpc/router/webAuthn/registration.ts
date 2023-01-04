import { AUTH_COOKIE_NAME } from "@server/common/get-server-auth-session";
import { User } from "@server/db/modals/User";
import { UserChallenge } from "@server/db/modals/UserChallenge";
import { publicProcedure } from "@server/trpc/trpc";
import type { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { TRPCError } from "@trpc/server";
import { Duration } from "@utils/duration";
import { jwtCookie } from "@utils/jwtCookie";
import { Routes } from "@utils/routes";
import { WebAuthnUtils } from "@utils/webAuthn";
import { randomUUID } from "crypto";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import { TransportSchema } from "types/schema/WebAuthn/common";
import { RegisterCredentialSchema } from "types/schema/WebAuthn/RegistrationCredentialSchema";
import {
  ECDSA_W_SHA256_ALG,
  WEB_AUTHN_RP_ID,
  WEB_AUTHN_RP_NAME,
  WEB_AUTHN_RP_ORIGIN,
} from ".";

export const webAuthnRegistrationProcedures = {
  getRegistrationOptions: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const device = await User().getAuthenticators({ userId: user.id });

    const options = generateRegistrationOptions({
      rpName: WEB_AUTHN_RP_NAME,
      rpID: Routes.hostname,
      userID: user.id,
      userName: user.handle,
      attestationType: "direct",
      // Prevent users from re-registering existing authenticators
      excludeCredentials: device?.Authenticators.map((authenticator) => ({
        id: Buffer.from(authenticator.credentialId, "hex"),
        type: "public-key",
        transports: TransportSchema.parse(authenticator.transports),
      })),
      timeout: Duration.TWO_MINUTE_IN_MILLISECONDS,
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
    await UserChallenge().set(user.id, options.challenge);

    await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
      ...user,
      currentDeviceName: randomUUID(),
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

      if (user.state === "pendingRegistration") {
        await User().create({
          userId: user.id,
          userHandle: user.handle,
          authenticatorInfo: {
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
          },
        });
      }

      await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
        ...user,
        state: "loggedIn",
      });
      return { verified };
    }),
};
