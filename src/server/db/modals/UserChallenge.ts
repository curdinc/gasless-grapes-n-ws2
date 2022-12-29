import { Duration } from "@utils/duration";
import { ErrorMessages } from "@utils/messages";
import { redis } from "@utils/redis";

const getUserChallengeKey = (userId: string) => `${userId}-challenge`;

export function UserChallenge() {
  return {
    async set(userId: string, challenge: string): Promise<boolean> {
      const result = await redis.set(getUserChallengeKey(userId), challenge, {
        ex: Duration.THREE_MINUTES_IN_SECONDS,
      });
      if (!result) {
        throw new Error(
          ErrorMessages.errorSettingRedisValue(challenge, "userChallenge")
        );
      }
      return result === "OK";
    },
    async get(userId: string): Promise<string | null> {
      const challenge = await redis.get<string>(getUserChallengeKey(userId));
      return challenge;
    },
  };
}
