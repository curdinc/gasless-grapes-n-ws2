import { router } from "../trpc";
import { authRouter } from "./auth";
import { gasRefundRouter } from "./gaslessRefunds";
import { siweRouter } from "./signInWithEth";
import { webAuthnRouter } from "./webAuthn";

export const appRouter = router({
  auth: authRouter,
  webAuthn: webAuthnRouter,
  siwe: siweRouter,
  gasRefund: gasRefundRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
