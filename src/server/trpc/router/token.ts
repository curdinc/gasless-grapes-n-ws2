import { Links } from "@utils/links";
import { ethers } from "ethers";
import type { TokenDetailType } from "types/schema/alchemy/tokenApi";
import {
  TokenBalanceApiSchema,
  TokenMetadataApiSchema,
} from "types/schema/alchemy/tokenApi";
import type { SupportedChainType } from "types/schema/blockchain/chains";
import { productionChains } from "types/schema/blockchain/chains";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const tokenRouter = router({
  getBalance: protectedProcedure
    .input(z.object({ walletAddress: z.string() }))
    .query(async ({ ctx, input }) => {
      // const { user } = ctx.session;
      // const wallet = await SmartContractWallet().getWalletByAddress({
      //   walletAddress: input.walletAddress,
      // });
      // if (!wallet) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: ErrorMessages.invalidWalletAddress,
      //   });
      // }
      const tokenBalances: Record<
        SupportedChainType,
        Array<TokenDetailType>
      > = { Mumbai: [], Ethereum: [], Goerli: [], Polygon: [] };
      for (const chain of productionChains) {
        const provider = new ethers.providers.JsonRpcProvider(
          Links.rpcUrl({ chain })
        );
        const result = TokenBalanceApiSchema.parse(
          await provider.send("alchemy_getTokenBalances", [input.walletAddress])
        );
        const _tokenBalances = result.tokenBalances.filter(
          (balance) => balance.tokenBalance !== ethers.constants.HashZero
        );
        tokenBalances[chain] = await Promise.all(
          _tokenBalances.map(async (balance) => {
            const tokenMetadata = TokenMetadataApiSchema.parse(
              await provider.send("alchemy_getTokenMetadata", [
                balance.contractAddress,
              ])
            );
            return { ...balance, ...tokenMetadata };
          })
        );
      }
      return tokenBalances;
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
