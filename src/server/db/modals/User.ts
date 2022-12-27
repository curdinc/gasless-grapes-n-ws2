import type { Prisma } from "@prisma/client";
import { prisma, PrismaObject } from "../client";

export function User() {
  return Object.assign(PrismaObject, {
    async maybeCreateUserForRegistration({
      userId,
      email,
    }: {
      userId: string;
      email?: string;
    }) {
      return prisma.user.upsert({
        where: {
          id: userId,
          email,
        },
        create: {
          id: userId,
          email,
        },
        update: {
          email,
        },
        include: {
          authenticators: {
            select: {
              credentialId: true,
              transports: true,
            },
          },
        },
      });
    },
   
  });
}
