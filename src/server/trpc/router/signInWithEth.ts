import { TRPCError } from "@trpc/server";
import { jwtCookie } from "@utils/jwtCookie";
import { generateNonce, SiweMessage } from "siwe";
import type { SiweNonceType, SiweType } from "types/schema/AuthUserSchema";
import { SiweSchema } from "types/schema/AuthUserSchema";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const SIWE_NONCE_COOKIE_NAME = "siwe-nonce";
export const SIWE_COOKIE_NAME = "siwe";

export const siweRouter = router({
  nonce: publicProcedure.query(async ({ ctx }) => {
    const nonce = generateNonce();
    await jwtCookie.set<SiweNonceType>(ctx.res, SIWE_NONCE_COOKIE_NAME, {
      nonce,
    });
    return nonce;
  }),
  verify: publicProcedure
    .input(
      z.object({
        message: SiweSchema,
        signature: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.siweNonce) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      const { nonce } = ctx.session.siweNonce;
      const siweMessage = new SiweMessage(input.message);
      const fields = await siweMessage.validate(input.signature);

      if (fields.nonce !== nonce) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      await jwtCookie.set<SiweType>(ctx.res, SIWE_COOKIE_NAME, { ...fields });
      return { address: fields.address };
    }),
  me: publicProcedure.query(async ({ ctx }) => {
    return { address: ctx.session?.siwe?.address };
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    await jwtCookie.expire(ctx.res, SIWE_COOKIE_NAME);
  }),
});
