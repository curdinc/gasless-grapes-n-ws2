import { AUTH_COOKIE_NAME } from "@server/common/get-server-auth-session";
import { User } from "@server/db/modals/User";
import { TRPCError } from "@trpc/server";
import { jwtCookie } from "@utils/jwtCookie";
import { randomUUID } from "crypto";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import { UserRegistrationSchema } from "types/schema/registration/user";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  verifyHandle: publicProcedure
    .input(UserRegistrationSchema)
    .mutation(async ({ input, ctx }) => {
      const { handle, email } = input;
      const userAlreadyExists = await User().exists(handle, email);
      if (!userAlreadyExists) {
        const userId = randomUUID();
        const user = await User().createRegistration({
          handle: handle,
          userId,
          email,
        });
        await jwtCookie.set<AuthUserType>(ctx.res, AUTH_COOKIE_NAME, {
          id: user.id,
          handle,
          state: "pendingRegistration",
          currentDeviceName: "",
        });
      }
      return { userAlreadyExists };
    }),
  canRegisterNewUser: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
    return User().canCreate({ userHandle: user.handle });
  }),
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.session?.user ?? null;
  }),
});
