import type { Prisma } from "@prisma/client";
import { Duration } from "@utils/duration";
import { ErrorMessages } from "@utils/messages";
import { redis } from "@utils/redis";
import { prisma, PrismaObject } from "../client";

function getUserRegistrationKey(userId: string) {
  return `registration-${userId}`;
}

export function User() {
  return Object.assign(PrismaObject, {
    async createUser({
      userId,
      authenticatorInfo,
    }: {
      userId: string;
      authenticatorInfo: Prisma.DeviceAuthenticatorUncheckedCreateWithoutUserInput;
    }) {
      const email = await redis.get<string>(getUserRegistrationKey(userId));
      return prisma.user.create({
        data: {
          id: userId,
          email,
          Authenticators: {
            create: authenticatorInfo,
          },
        },
      });
    },
    async createRegistration({
      userId,
      email,
    }: {
      userId: string;
      email?: string;
    }) {
      const result = await redis.set(getUserRegistrationKey(userId), email, {
        // needs to be longer than the registration timeout in registration.ts
        ex: Duration.THREE_MINUTES_IN_SECONDS,
      });
      if (!result) {
        throw new Error(
          ErrorMessages.errorSettingRedisValue(
            email ?? "<empty_email>",
            "createRegistration"
          )
        );
      }
      return { id: userId, email };
    },

    async getUserAuthenticators({ userId }: { userId: string }) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          Authenticators: {
            select: {
              credentialId: true,
              transports: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error(ErrorMessages.userDoesNotExists);
      }
      return user;
    },
  });
}
