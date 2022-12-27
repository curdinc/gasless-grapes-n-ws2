/*
  Warnings:

  - You are about to drop the `UserChallenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserChallenge" DROP CONSTRAINT "UserChallenge_userId_fkey";

-- DropTable
DROP TABLE "UserChallenge";
