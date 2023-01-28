import { z } from "zod";

export const TenderlyChains = ["Goerli", "Ethereum"] as const;
export type TenderlyChainType = typeof TenderlyChains[number];

export const AlchemyChains = ["Mumbai", "Polygon", ...TenderlyChains] as const;
export type AlchemyChainType = typeof AlchemyChains[number];

export const testnetChains = [AlchemyChains[0], TenderlyChains[0]] as const;
export const productionChains = [AlchemyChains[1], TenderlyChains[1]] as const;

export const SupportedChains = [...AlchemyChains] as const;
export const SupportedChainSchema = z.enum([...SupportedChains]);
export type SupportedChainType = z.infer<typeof SupportedChainSchema>;

export const SupportedChainIds: Record<
  SupportedChainType,
  SupportedChainIdsType
> = {
  Ethereum: 1,
  Goerli: 5,
  Polygon: 137,
  Mumbai: 80001,
};
export const SupportedChainIdsSchema = z.union([
  z.literal(1),
  z.literal(5),
  z.literal(137),
  z.literal(80001),
]);
export type SupportedChainIdsType = z.infer<typeof SupportedChainIdsSchema>;
