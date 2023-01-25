import type {
  SmartContractWallet,
  SmartContractWalletDetails,
} from "@prisma/client";
import { z } from "zod";
import { SupportedChainSchema } from "./blockchain/chains";
import { WalletConnectLegacyTransactionSchema } from "./blockchain/walletConnect";

export type SmartContractWalletType =
  | (SmartContractWallet & {
      SmartContractWalletDetails: SmartContractWalletDetails[];
    })
  | null;

export const SmartContractWalletOptions: {
  [key in SmartContractWalletOptionsType]: key;
} = {
  Default: "Default",
  Regular: "Regular",
};
export const SmartContractWalletOptionsSchema = z.enum(["Default", "Regular"]);
export type SmartContractWalletOptionsType = z.infer<
  typeof SmartContractWalletOptionsSchema
>;

export const SmartContractWalletCreationSchema = z.object({
  type: SmartContractWalletOptionsSchema,
});
export type SmartContractWalletCreationType = z.infer<
  typeof SmartContractWalletCreationSchema
>;

export const SmartContractWalletDeploymentSchema = z.object({
  chain: SupportedChainSchema,
  walletAddress: z.string(),
});
export type SmartContractWalletDeploymentType = z.infer<
  typeof SmartContractWalletDeploymentSchema
>;

export const FetchSmartContractWalletByAddressSchema = z.object({
  chain: SupportedChainSchema,
  walletAddress: z.string(),
});

export const FetchSmartContractWalletByTypeSchema = z.object({
  type: SmartContractWalletOptionsSchema,
});

export const SendSmartContractWalletTransactionSchema = z.object({
  signature: z.string(),
  transaction: WalletConnectLegacyTransactionSchema,
  walletAddress: z.string(),
  chain: SupportedChainSchema,
  nonce: z.string(),
});
export type SendSmartContractWalletTransactionType = z.infer<
  typeof SendSmartContractWalletTransactionSchema
>;
