import { env } from "@env/server.mjs";
import { router } from "@server/trpc/trpc";
import { webAuthnAuthenticationProcedures } from "./authentication";
import { webAuthnRegistrationProcedures } from "./registration";

export const TWO_MINUTE_IN_MILLISECONDS = 120_000;

// Human-readable title for your website
export const WEB_AUTHN_RP_NAME = "Gasless Grapes";

export const WEB_AUTHN_CURRENT_RP_ID =
  env.NODE_ENV === "development"
    ? "054d-142-189-10-126.ngrok.io"
    : "gaslessgrapes.com";

// A unique identifier for your website
export const WEB_AUTHN_RP_ID_DEV = [
  WEB_AUTHN_CURRENT_RP_ID,
  "054d-142-189-10-126.ngrok.io",
  "localhost",
];
// The URL at which registrations and authentications should occur
export const WEB_AUTHN_RP_ORIGIN_DEV = [
  `https://${WEB_AUTHN_RP_ID_DEV[0]}`,
  "http://localhost:3000",
];

export const WEB_AUTHN_RP_ID_PROD = [
  WEB_AUTHN_CURRENT_RP_ID,
  "gaslessgrapes.com",
  "gaslessgrapes.vercel.app",
];
export const WEB_AUTHN_RP_ORIGIN_PROD = WEB_AUTHN_RP_ID_PROD.map((id) => {
  return `https://${id}`;
});

export const WEB_AUTHN_RP_ID =
  env.NODE_ENV === "development" ? WEB_AUTHN_RP_ID_DEV : WEB_AUTHN_RP_ID_PROD;
export const WEB_AUTHN_RP_ORIGIN =
  env.NODE_ENV === "development"
    ? WEB_AUTHN_RP_ORIGIN_DEV
    : WEB_AUTHN_RP_ORIGIN_PROD;

// ECDSA w/ SHA-256
export const ECDSA_W_SHA256_ALG = -7;

export const webAuthnRouter = router({
  ...webAuthnAuthenticationProcedures,
  ...webAuthnRegistrationProcedures,
});
