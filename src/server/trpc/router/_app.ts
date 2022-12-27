import { router } from "../trpc";
import { authRouter } from "./auth";
import { webAuthnRouter } from "./webAuthn";

export const appRouter = router({
  auth: authRouter,
  webAuthn: webAuthnRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
