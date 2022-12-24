import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { webAuthnRouter } from "./webAuthn";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  webAuthn: webAuthnRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
