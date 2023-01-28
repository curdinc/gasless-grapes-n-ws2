import { decodeSendOneTransactionInput } from "@server/common/ethers";
import { ethers } from "ethers";
import { env } from "process";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

function getEtherScanApiKey(args: { chainId: number }) {
  if ("chainId" in args) {
    const chainId = args.chainId;
    switch (chainId) {
      case 1:
      case 5:
        return env.ETH_BLOCK_EXPLORER_API_KEY;
      case 80001:
      case 137:
        return env.POLYGON_BLOCK_EXPLORER_API_KEY;
      default:
        throw new Error(`Invalid ChainId: ${chainId}`);
    }
  }
}
export const walletTransactionsRouter = router({
  getTransactions: protectedProcedure
    .input(
      z.object({
        chainId: z.number(),
        walletAddress: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const etherScanProvider = new ethers.providers.EtherscanProvider(
        input.chainId,
        getEtherScanApiKey({ chainId: input.chainId })
      );
      const histories = await etherScanProvider.getHistory(input.walletAddress);
      return histories.map((history) => {
        const inputArgs = decodeSendOneTransactionInput(history);
        return {
          value: history.value,
          from: input.walletAddress,
          to: inputArgs.transaction.target as string,
          data: inputArgs.transaction.data as string,
          hash: history.hash,
        };
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
