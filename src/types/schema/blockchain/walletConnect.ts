import { z } from "zod";

export const WalletConnectLegacyTransactionSchema = z.object({
  from: z.string(),
  to: z.string(),
  gasPrice: z.string(),
  gas: z.string(),
  value: z.string(),
  nonce: z.string(),
  data: z.string(),
});

export type WalletConnectLegacyTransactionType = z.infer<
  typeof WalletConnectLegacyTransactionSchema
>;
