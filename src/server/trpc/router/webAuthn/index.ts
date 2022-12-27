import { env } from "@env/server.mjs";
import { router } from "@server/trpc/trpc";
import { webAuthnAuthenticationProcedures } from "./authentication";
import { webAuthnRegistrationProcedures } from "./registration";

export const TWO_MINUTE_IN_MILLISECONDS = 120_000;

// Human-readable title for your website
export const WEB_AUTH_RP_NAME = "Gasless Grapes";
// A unique identifier for your website
export const WEB_AUTH_RP_ID =
  env.NODE_ENV === "development" ? "d1a9-142-189-10-126.ngrok.io" : "";
// The URL at which registrations and authentications should occur
export const WEB_AUTH_RP_ORIGIN =
  env.NODE_ENV === "development" ? `https://${WEB_AUTH_RP_ID}` : "";
// ECDSA w/ SHA-256
export const ECDSA_W_SHA256_ALG = -7;

export const webAuthnRouter = router({
  ...webAuthnAuthenticationProcedures,
  ...webAuthnRegistrationProcedures,
});
