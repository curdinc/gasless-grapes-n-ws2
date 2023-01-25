import type { SupportedChainType } from "types/schema/blockchain/chains";
import { prisma, PrismaObject } from "../client";

export function SmartContractWalletDetails() {
  return Object.assign(PrismaObject, {
    async deployed({
      chain,
      openZeppelinTransactionId,
      smartContractWalletId,
    }: {
      chain: SupportedChainType;
      openZeppelinTransactionId: string;
      smartContractWalletId: string;
    }) {
      return await prisma.smartContractWalletDetails.create({
        data: {
          chain: chain,
          deployedAt: new Date(),
          openZeppelinTransactionId,
          smartContractWalletId,
        },
      });
    },
  });
}
