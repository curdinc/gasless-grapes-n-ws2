import { prisma, PrismaObject } from "../client";

export function UserChallenge() {
  return Object.assign(PrismaObject, {
    async saveChallenge(
      userId: string,
      challenge: string
    ): Promise<{ userId: string; challenge: string; id: string }> {
      const challengeResult = await prisma.userChallenge.upsert({
        where: { userId },
        update: {
          challenge,
        },
        create: {
          challenge,
          userId,
        },
      });
      return challengeResult;
    },

    async getChallengeString(userId: string): Promise<string | null> {
      const challenge = await prisma.userChallenge.findUnique({
        where: {
          userId,
        },
        select: {
          challenge: true,
        },
      });
      return challenge ? challenge.challenge : null;
    },
  });
}
