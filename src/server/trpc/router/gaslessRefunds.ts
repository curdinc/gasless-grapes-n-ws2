import { GasRefund } from "@server/db/modals/GasRefund";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const gasRefundRouter = router({
  generateCodes: publicProcedure
    .input(z.object({ numberOfCode: z.number() }))
    .mutation(async ({ input }) => {
      const accessCodes = await GasRefund().generateAccessCode(
        input.numberOfCode
      );
      return accessCodes;
    }),
  submitRefund: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        accessCode: z.string(),
        transactions: z.string().url().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.siwe) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const { address } = ctx.session.siwe;
      try {
        await GasRefund().submitRefund({
          accessCode: input.accessCode,
          email: input.email,
          transactions: input.transactions,
          walletAddress: address,
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes("Unique")) {
            const duplicatedField = e.message
              .split("fields: (`")[1]
              ?.slice(0, -2);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${duplicatedField} already used, please try another ${duplicatedField}`,
            });
          }
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: e.message,
          });
        }
        throw e;
      }
    }),
});
