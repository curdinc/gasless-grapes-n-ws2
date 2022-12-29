import { ErrorMessages } from "@utils/messages";
import { SmartContractWalletType } from "types/schema/SmartContractWallet";

import { prisma, PrismaObject } from "../client";

export function SmartContractWallet() {
  return Object.assign(PrismaObject, {
    /**
     * Attempts to create a smart contract wallet row with "Default" type
     * throws if there is an  existing row in the DB
     */
    async createDefaultWallet({
      userId,
      walletSalt,
      address,
    }: {
      userId: string;
      walletSalt: string;
      address: string;
    }) {
      const wallet = await SmartContractWallet().getDefault({
        userId,
      });

      if (wallet) {
        throw new Error(ErrorMessages.defaultSmartContractWalletAlreadyExists);
      }

      return prisma.smartContractWallet.create({
        data: {
          address,
          creationHash: walletSalt,
          userId,
          type: SmartContractWalletType.Default,
        },
      });
    },
    async getWalletByAddress({ walletAddress }: { walletAddress: string }) {
      return prisma.smartContractWallet.findUnique({
        where: {
          address: walletAddress,
        },
      });
    },
    async getDefault({ userId }: { userId: string }) {
      const wallets = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          SmartContractWallet: {
            where: {
              type: SmartContractWalletType.Default,
            },
          },
        },
      });
      if (
        wallets?.SmartContractWallet &&
        wallets.SmartContractWallet.length > 1
      ) {
        throw new Error(ErrorMessages.tooManyDefaultSmartContractWallets);
      }
      return wallets?.SmartContractWallet?.[0] ?? null;
    },
    async getAll({ userId }: { userId: string }) {
      const wallets = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          SmartContractWallet: true,
        },
      });
      return wallets?.SmartContractWallet ?? null;
    },
  });
}
