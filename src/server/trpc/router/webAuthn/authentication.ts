import { AUTH_COOKIE_NAME } from "@server/common/get-server-auth-session";
import { DeviceAuthenticator } from "@server/db/modals/DeviceAuthenticator";
import { UserChallenge } from "@server/db/modals/UserChallenge";
import { publicProcedure } from "@server/trpc/trpc";
import type { VerifiedAuthenticationResponse } from "@simplewebauthn/server";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { TRPCError } from "@trpc/server";
import { Duration } from "@utils/duration";
import { jwtCookie } from "@utils/jwtCookie";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { WebAuthnUtils } from "@utils/webAuthn";
import { randomUUID } from "crypto";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import { AuthenticationCredentialSchema } from "types/schema/WebAuthn/AuthenticationCredentialSchema";
import { TransportSchema } from "types/schema/WebAuthn/common";
import { WEB_AUTHN_RP_ID, WEB_AUTHN_RP_ORIGIN } from ".";

export const webAuthnAuthenticationProcedures = {
  getAuthenticationOptions: publicProcedure.query(async ({ ctx }) => {
    const options = generateAuthenticationOptions({
      // You can require users to use a previously-registered authenticator here
      allowCredentials: [],
      userVerification: "preferred",
      rpID: Routes.hostname,
      timeout: Duration.TWO_MINUTE_IN_MILLISECONDS,
      extensions: {
        uvm: true,
      },
    });
    // save the challenge information
    const userId = randomUUID();
    await UserChallenge().set(userId, options.challenge);

    await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
      currentDeviceName: "",
      id: userId,
      state: "pendingAuthentication",
    });
    return options;
  }),
  verifyAuthentication: publicProcedure
    .input(AuthenticationCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const challenge = await UserChallenge().get(user?.id || "");
      if (!ctx.session || !user || !challenge) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ErrorMessages.somethingWentWrong,
        });
      }

      const authenticator = await DeviceAuthenticator().getAuthenticatorById(
        WebAuthnUtils.base64UrlToHexString(input.id)
      );
      if (!authenticator) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ErrorMessages.unknownAuthenticator,
        });
      }
      let verification: VerifiedAuthenticationResponse;
      try {
        verification = await verifyAuthenticationResponse({
          credential: input,
          expectedChallenge: challenge,
          expectedOrigin: WEB_AUTHN_RP_ORIGIN,
          expectedRPID: WEB_AUTHN_RP_ID,
          authenticator: {
            credentialID: WebAuthnUtils.hexStringToBuffer(
              authenticator.credentialId
            ),
            credentialPublicKey: WebAuthnUtils.hexStringToBuffer(
              authenticator.credentialPublicKey
            ),
            transports: TransportSchema.parse(authenticator.transports),
            counter: authenticator.counter,
          },
          requireUserVerification: true,
        });
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ErrorMessages.unknownAuthenticator,
        });
      }

      const { verified, authenticationInfo } = verification;
      if (!authenticationInfo) {
        return { verified };
      }

      await DeviceAuthenticator().updateAuthenticatorCount({
        credentialId: WebAuthnUtils.bufferToHexString(
          authenticationInfo.credentialID
        ),
        newCount: authenticationInfo.newCounter,
      });
      await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
        currentDeviceName: authenticator.deviceName,
        id: authenticator.User.id,
        state: "loggedIn",
      });
      return { verified };
    }),
};
