import { env } from "@env/server.mjs";
import type {
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const ONE_MINUTE_IN_MILLISECONDS = 60_000;

// Human-readable title for your website
export const WEB_AUTH_RP_NAME = "Gasless Grapes";
// A unique identifier for your website
export const WEB_AUTH_RP_ID = env.NODE_ENV === "development" ? "localhost" : "";
// The URL at which registrations and authentications should occur
export const WEB_AUTH_RP_ORIGIN =
  env.NODE_ENV === "development" ? `http://${WEB_AUTH_RP_ID}:3000` : "";
// ECDSA w/ SHA-256
export const ECDSA_W_SHA256_ALG = -7;

let tempCredId = "";
let tempPubKey = "";

export const webAuthnRouter = router({
  getRegistrationOptions: publicProcedure.query(({ ctx }) => {
    const { prisma } = ctx;
    const options = generateRegistrationOptions({
      rpName: WEB_AUTH_RP_NAME,
      rpID: WEB_AUTH_RP_ID,
      userID: "1234",
      userName: "test username",
      // userDisplayName: "user display name",
      attestationType: "direct",
      // Prevent users from re-registering existing authenticators
      //   excludeCredentials: userAuthenticators.map((authenticator) => ({
      //     id: authenticator.credentialID,
      //     type: "public-key",
      //     // Optional
      //     transports: authenticator.transports,
      //   })),
      challenge: Buffer.from("abcdefg", "utf-8"),
      timeout: ONE_MINUTE_IN_MILLISECONDS,
      authenticatorSelection: {
        // "Discoverable credentials" used to be called "resident keys". The
        // old name persists in the options passed to `navigator.credentials.create()`.
        residentKey: "required",
        userVerification: "preferred",
        requireResidentKey: true,
        authenticatorAttachment: "platform",
      },
      supportedAlgorithmIDs: [ECDSA_W_SHA256_ALG],
      extensions: {
        credProps: true,
        uvm: true,  
      },
    });

    console.log("options", options);

    return options;
  }),
  verifyRegistration: publicProcedure
    .input(z.any())
    .mutation(async ({ input }) => {
      console.log("input", input);
      console.log(
        'JSON.parse(Buffer.from(input.response.clientDataJSON, "base64url").toString("utf-8"))',
        JSON.parse(
          Buffer.from(input.response.clientDataJSON, "base64url").toString(
            "utf-8"
          )
        )
      );

      let verification: VerifiedRegistrationResponse;
      try {
        verification = await verifyRegistrationResponse({
          credential: input,
          expectedChallenge: Buffer.from("abcdefg", "utf-8").toString(
            "base64url"
          ),
          expectedOrigin: WEB_AUTH_RP_ORIGIN,
          expectedRPID: WEB_AUTH_RP_ID,
          requireUserVerification: true,
          supportedAlgorithmIDs: [ECDSA_W_SHA256_ALG],
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const { verified, registrationInfo } = verification;
      console.log("verified", verified);
      console.log("registrationInfo", registrationInfo);

      if (!registrationInfo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      const newAuthenticator = {
        credentialID,
        credentialPublicKey,
        counter,
      };
      tempCredId = credentialID.toString("hex");
      console.log('credentialID.toString("hex")', credentialID.toString("hex"));
      tempPubKey = credentialPublicKey.toString("hex");
      console.log(
        'credentialPublicKey.toString("hex")',
        credentialPublicKey.toString("hex")
      );
      console.log("newAuthenticator", newAuthenticator);

      return "OK";
    }),
  getAuthenticationOptions: publicProcedure.query(() => {
    console.log("tempCredId", tempCredId);
    const options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: [
        {
          id: Buffer.from(tempCredId, "hex"),
          type: "public-key",
          // Optional
          transports: ["internal"],
        },
      ],
      challenge: Buffer.from("abcdefg", "utf-8"),
      userVerification: "preferred",
    });
    console.log("options", options);
    return options;
  }),
  verifyAuthentication: publicProcedure
    .input(z.any())
    .mutation(async ({ input }) => {
      console.log("input", input);
      let verification: VerifiedAuthenticationResponse;
      try {
        verification = await verifyAuthenticationResponse({
          credential: input,
          expectedChallenge: Buffer.from("abcdefg", "utf-8").toString(
            "base64url"
          ),
          expectedOrigin: WEB_AUTH_RP_ORIGIN,
          expectedRPID: WEB_AUTH_RP_ID,
          authenticator: {
            credentialID: Buffer.from(tempCredId, "hex"),
            credentialPublicKey: Buffer.from(tempPubKey, "hex"),
            transports: ["internal"],
            counter: 0,
          },
          requireUserVerification: true,
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const { verified, authenticationInfo } = verification;
      console.log("verified", verified);
      console.log("authenticationInfo", authenticationInfo);
    }),
});
