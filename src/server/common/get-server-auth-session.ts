import {
  SIWE_COOKIE_NAME,
  SIWE_NONCE_COOKIE_NAME,
} from "@server/trpc/router/signInWithEth";
import { jwtCookie } from "@utils/jwtCookie";

import type { AuthSessionType } from "types/schema/AuthUserSchema";
import { AuthUserSchema } from "types/schema/AuthUserSchema";
import { SiweNonceSchema, SiweSchema } from "types/schema/Siwe/SiweSchema";

export const AUTH_COOKIE_NAME = "id";
/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  cookieString: string | undefined;
}): Promise<AuthSessionType> => {
  return {
    user: await jwtCookie.get({
      cookieString: ctx.cookieString,
      name: AUTH_COOKIE_NAME,
      schema: AuthUserSchema,
    }),
    siweNonce: await jwtCookie.get({
      cookieString: ctx.cookieString,
      name: SIWE_NONCE_COOKIE_NAME,
      schema: SiweNonceSchema,
    }),
    siwe: await jwtCookie.get({
      cookieString: ctx.cookieString,
      name: SIWE_COOKIE_NAME,
      schema: SiweSchema,
    }),
  };
};
