import { redis } from "@utils/redis";

const THREE_MINUTES_IN_SECONDS = 180;
const makeUserChallengeKey = (userId: string) => `${userId}-challenge`;
export function UserChallenge() {
  return {
    async set(userId: string, challenge: string): Promise<boolean> {
      const result = await redis.set(makeUserChallengeKey(userId), challenge, {
        ex: THREE_MINUTES_IN_SECONDS,
      });
      return result === "OK";
    },
    async get(userId: string): Promise<string | null> {
      const challenge = await redis.get<string>(makeUserChallengeKey(userId));
      return challenge;
    },
  };
}
