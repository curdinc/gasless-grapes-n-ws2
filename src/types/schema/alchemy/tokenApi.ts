import { z } from "zod";

export const TokenBalanceApiSchema = z.object({
  address: z.string(),
  tokenBalances: z
    .object({
      contractAddress: z.string(),
      tokenBalance: z.string(),
    })
    .array(),
});
export type TokenBalanceApiType = z.infer<typeof TokenBalanceApiSchema>;

export const TokenMetadataApiSchema = z.object({
  decimals: z.number(),
  logo: z.string().url().nullable(),
  name: z.string(),
  symbol: z.string(),
});
export type TokenMetadataApiType = z.infer<typeof TokenMetadataApiSchema>;

export type TokenDetailType = TokenMetadataApiType &
  TokenBalanceApiType["tokenBalances"][0];
