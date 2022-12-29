import { router } from "../trpc";
import { gasRefundRouter } from "./gaslessRefunds";
import { authRouter } from "./routerReference";
import { siweRouter } from "./signInWithEth";
import { smartContractWalletRouter } from "./smartContractWallet";
import { tokenRouter } from "./token";
import { webAuthnRouter } from "./webAuthn";

export const appRouter = router({
  auth: authRouter,
  webAuthn: webAuthnRouter,
  siwe: siweRouter,
  gasRefund: gasRefundRouter,
  smartContractWallet: smartContractWalletRouter,
  token: tokenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
