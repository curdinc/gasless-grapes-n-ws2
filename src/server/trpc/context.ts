import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { AuthSessionType } from "types/schema/AuthUserSchema";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";

type CreateContextOptions = {
  session: AuthSessionType | null;
};

/** Use this helper for:
 * - testing, so we don't have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({
    cookieString: req.headers.cookie,
  });

  return {
    ...(await createContextInner({
      session,
    })),
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
