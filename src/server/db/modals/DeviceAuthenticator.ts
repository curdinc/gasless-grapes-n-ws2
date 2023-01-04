import type { Prisma } from "@prisma/client";
import { prisma, PrismaObject } from "../client";

export function DeviceAuthenticator() {
  return Object.assign(PrismaObject, {
    async saveNewAuthenticator(
      data: Prisma.DeviceAuthenticatorUncheckedCreateInput
    ) {
      const authenticator = await prisma.deviceAuthenticator.create({
        data,
        select: {
          id: true,
        },
      });
      return authenticator;
    },
    async getAuthenticatorById(credentialId: string) {
      const authenticator = await prisma.deviceAuthenticator.findUnique({
        where: {
          credentialId,
        },
        select: {
          credentialId: true,
          credentialPublicKey: true,
          counter: true,
          transports: true,
          deviceName: true,
          User: {
            select: {
              id: true,
              handle: true,
            },
          },
        },
      });
      return authenticator;
    },

    async updateAuthenticatorCount({
      credentialId,
      newCount,
    }: {
      credentialId: string;
      newCount: number;
    }) {
      await prisma.deviceAuthenticator.update({
        where: {
          credentialId,
        },
        data: {
          counter: newCount,
        },
      });
    },
  });
}
