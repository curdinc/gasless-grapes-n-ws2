import { ServerRoutes } from "@server/common/serverRoutes";
import { router } from "@server/trpc/trpc";
import { webAuthnAuthenticationProcedures } from "./authentication";
import { webAuthnRegistrationProcedures } from "./registration";

// Human-readable title for your website
export const WEB_AUTHN_RP_NAME = "Gasless Grapes";

// A unique identifier for your website
export const WEB_AUTHN_RP_ID = [
  ServerRoutes.serverHostname,
  "localhost",
  "gaslessgrapes.vercel.app",
];
// The URL at which registrations and authentications should occur
export const WEB_AUTHN_RP_ORIGIN = WEB_AUTHN_RP_ID.map((id) => {
  return `https://${id}`;
}).concat(["http://localhost:3000"]);

// ECDSA w/ SHA-256
export const ECDSA_W_SHA256_ALG = -7;

export const webAuthnRouter = router({
  ...webAuthnAuthenticationProcedures,
  ...webAuthnRegistrationProcedures,
});
