import { ErrorMessages } from "@utils/messages";
import type { SmartContractWalletOptionsType } from "types/schema/SmartContractWallet";
import { SmartContractWalletOptions } from "types/schema/SmartContractWallet";

import { prisma, PrismaObject } from "../client";

export function SmartContractWallet() {
  return Object.assign(PrismaObject, {
    /**
     * Attempts to create a smart contract wallet row with "Default" type
     * throws if there is an  existing row in the DB
     */
    async create({
      userId,
      walletSalt,
      eoaAddress,
      address,
      type,
    }: {
      userId: string;
      walletSalt: string;
      eoaAddress: string;
      address: string;
      type: SmartContractWalletOptionsType;
    }) {
      if (type === SmartContractWalletOptions.Default) {
        const wallet = await SmartContractWallet().getByType({
          userId,
          type,
        });

        if (wallet?.[0]) {
          throw new Error(
            ErrorMessages.defaultSmartContractWalletAlreadyExists
          );
        }
      }

      return prisma.smartContractWallet.create({
        data: {
          address,
          creationSalt: walletSalt,
          creationEoa: eoaAddress,
          userId,
          type: SmartContractWalletOptions.Default,
        },
      });
    },
    async getByAddress({ walletAddress }: { walletAddress: string }) {
      const wallets = await prisma.smartContractWallet.findUnique({
        where: {
          address: walletAddress,
        },
        include: { SmartContractWalletDetails: true },
      });
      return wallets;
    },
    async getByType({
      userId,
      type,
    }: {
      userId: string;
      type: SmartContractWalletOptionsType;
    }) {
      const wallets = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          SmartContractWallet: {
            where: {
              type,
            },
            include: {
              SmartContractWalletDetails: true,
            },
          },
        },
      });
      return wallets?.SmartContractWallet ?? null;
    },

    async getAll({ userId }: { userId: string }) {
      const wallets = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          SmartContractWallet: {
            include: {
              SmartContractWalletDetails: true,
            },
          },
        },
      });
      return wallets?.SmartContractWallet ?? null;
    },
  });
}
