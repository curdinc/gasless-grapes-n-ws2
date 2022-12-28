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
import { jwtCookie } from "@utils/jwtCookie";
import { Routes } from "@utils/routes";
import { WebAuthnUtils } from "@utils/webAuthn";
import { randomUUID } from "crypto";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import { AuthenticationCredentialSchema } from "types/schema/WebAuthn/AuthenticationCredentialSchema";
import { TransportSchema } from "types/schema/WebAuthn/common";
import {
  TWO_MINUTE_IN_MILLISECONDS,
  WEB_AUTHN_RP_ID,
  WEB_AUTHN_RP_ORIGIN,
} from ".";

export const webAuthnAuthenticationProcedures = {
  getAuthenticationOptions: publicProcedure.query(async ({ ctx }) => {
    const options = generateAuthenticationOptions({
      // You can require users to use a previously-registered authenticator here
      allowCredentials: [],
      userVerification: "preferred",
      rpID: Routes.hostname,
      timeout: TWO_MINUTE_IN_MILLISECONDS,
      extensions: {
        uvm: true,
      },
    });
    // save the challenge information
    console.log("options", options);
    const userId = randomUUID();
    if (!(await UserChallenge().set(userId, options.challenge))) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
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
      console.log("challenge", challenge);
      if (!ctx.session || !user || !challenge) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      console.log(
        "WebAuthnUtils.base64UrlToHexString(input.id)",
        WebAuthnUtils.base64UrlToHexString(input.id)
      );
      const authenticator = await DeviceAuthenticator().getAuthenticatorById(
        WebAuthnUtils.base64UrlToHexString(input.id)
      );
      if (!authenticator) {
        throw new TRPCError({
          code: "BAD_REQUEST",
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
        });
      }

      const { verified, authenticationInfo } = verification;
      if (!authenticationInfo) {
        return { verified };
      }
      console.log("authenticationInfo", authenticationInfo);
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
