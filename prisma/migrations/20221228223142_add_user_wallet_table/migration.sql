/*
  Warnings:

  - You are about to drop the column `userChallengeId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userChallengeId";

-- CreateTable
CREATE TABLE "UserWallet" (
    "id" STRING NOT NULL,
    "creationHash" STRING NOT NULL,
    "address" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWallet_creationHash_key" ON "UserWallet"("creationHash");

-- CreateIndex
CREATE UNIQUE INDEX "UserWallet_address_key" ON "UserWallet"("address");

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
