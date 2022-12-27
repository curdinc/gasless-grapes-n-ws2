import { env } from "@env/server.mjs";
import { JwtCookie } from "@utils/jwtCookie";

import type { AuthSessionType } from "types/schema/AuthUserSchema";
import { AuthUserSchema } from "types/schema/AuthUserSchema";

export const AUTH_COOKIE_NAME = "id";
/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  cookieString: string | undefined;
}): Promise<AuthSessionType> => {
  const jwtCookie = new JwtCookie({ secret: env.JWT_SECRET });
  return {
    user: await jwtCookie.get({
      cookieString: ctx.cookieString,
      name: AUTH_COOKIE_NAME,
      schema: AuthUserSchema,
    }),
  };
};
