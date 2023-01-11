import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Duration } from "@utils/duration";
import { ErrorMessages } from "@utils/messages";
import { redis } from "@utils/redis";
import { UserRegistrationSchema } from "types/schema/registration/user";
import { prisma, PrismaObject } from "../client";

function getUserRegistrationKey(userHandle: string) {
  return `userRegistration-${userHandle}`;
}

export function User() {
  return Object.assign(PrismaObject, {
    async exists(userHandle: string, email?: string) {
      const user = await prisma.user.findMany({
        where: {
          OR: [{ handle: userHandle }, { email }],
        },
        select: {
          id: true,
        },
      });
      const pendingHandle = await redis.get<string>(
        getUserRegistrationKey(userHandle)
      );

      return !!user.length || !!pendingHandle;
    },
    async createRegistration({
      userId,
      handle,
      email,
    }: {
      userId: string;
      handle: string;
      email?: string;
    }) {
      const redisValue = JSON.stringify({ email, handle });
      const result = await redis.set(
        getUserRegistrationKey(handle),
        redisValue,
        {
          // needs to be longer than the registration timeout in registration.ts
          ex: Duration.THREE_MINUTES_IN_SECONDS,
        }
      );
      if (!result) {
        throw new Error(
          ErrorMessages.errorSettingRedisValue(
            redisValue ?? "<empty_JSON_object>",
            "createRegistration"
          )
        );
      }
      return { id: userId, email, handle };
    },
    async canCreate({ userHandle }: { userHandle: string }) {
      const registrationDataRaw = await redis.get(
        getUserRegistrationKey(userHandle)
      );
      return !!registrationDataRaw;
    },
    async create({
      userId,
      userHandle,
      authenticatorInfo,
    }: {
      userId: string;
      userHandle: string;
      authenticatorInfo: Prisma.DeviceAuthenticatorUncheckedCreateWithoutUserInput;
    }) {
      const registrationDataKey = getUserRegistrationKey(userHandle);

      const registrationDataRaw = await redis.get(registrationDataKey);
      if (!registrationDataRaw) {
        throw new Error(
          ErrorMessages.errorFindingRedisValue(registrationDataKey)
        );
      }
      const registrationData =
        UserRegistrationSchema.parse(registrationDataRaw);

      try {
        return await prisma.user.create({
          data: {
            id: userId,
            handle: userHandle,
            email: registrationData.email,
            Authenticators: {
              create: authenticatorInfo,
            },
          },
        });
      } catch (e) {
        if (
          e instanceof Error &&
          e.message.includes(ErrorMessages.Prisma.fieldAlreadyExists)
        ) {
          const field = e.message
            .split(ErrorMessages.Prisma.fieldAlreadyExists)?.[1]
            ?.slice(0, -2);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: ErrorMessages.fieldAlreadyExists(field ?? ""),
          });
        }
        throw e;
      }
    },
    async getAuthenticators({ userId }: { userId: string }) {
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

      return user;
    },
  });
}
