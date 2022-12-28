import { ErrorMessages } from "@utils/messages";
import { prisma, PrismaObject } from "../client";

function makeId(length = 7) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function GasRefund() {
  return Object.assign(PrismaObject, {
    async generateAccessCode(count: number) {
      const accessCodes = Array.from(Array(count)).map(() => makeId());
      await prisma.gasRefund.createMany({
        data: accessCodes.map((accessCode) => {
          return {
            accessCode,
            transactions: [],
          };
        }),
        skipDuplicates: true,
      });
      return accessCodes;
    },

    async submitRefund({
      accessCode,
      email,
      transactions,
      walletAddress,
    }: {
      accessCode: string;
      email: string;
      transactions: string[];
      walletAddress: string;
    }) {
      const gasRefund = await prisma.gasRefund.findUnique({
        where: {
          accessCode,
        },
      });
      if (!gasRefund) {
        throw new Error(ErrorMessages.invalidAccessCode);
      }
      if (gasRefund.walletAddress || gasRefund.email) {
        throw new Error(ErrorMessages.accessCodeAlreadyUsed);
      }
      const updateGasRefund = await prisma.gasRefund.update({
        where: {
          accessCode,
        },
        data: {
          email,
          transactions,
          walletAddress,
        },
      });
      return updateGasRefund;
    },
  });
}
