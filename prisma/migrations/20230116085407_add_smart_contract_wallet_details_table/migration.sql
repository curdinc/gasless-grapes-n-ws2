/*
  Warnings:

  - You are about to drop the column `creationHash` on the `SmartContractWallet` table. All the data in the column will be lost.
  - You are about to drop the column `deployedAt` on the `SmartContractWallet` table. All the data in the column will be lost.
  - You are about to drop the column `deploymentHash` on the `SmartContractWallet` table. All the data in the column will be lost.
  - You are about to drop the column `smartContractWalletId` on the `Tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[creationSalt]` on the table `SmartContractWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creationSalt` to the `SmartContractWallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smartContractWalletDetailsId` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_smartContractWalletId_fkey";

-- DropIndex
DROP INDEX "SmartContractWallet_creationHash_key";

-- AlterTable
ALTER TABLE "SmartContractWallet" DROP COLUMN "creationHash";
ALTER TABLE "SmartContractWallet" DROP COLUMN "deployedAt";
ALTER TABLE "SmartContractWallet" DROP COLUMN "deploymentHash";
ALTER TABLE "SmartContractWallet" ADD COLUMN     "creationSalt" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "smartContractWalletId";
ALTER TABLE "Tokens" ADD COLUMN     "smartContractWalletDetailsId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "SmartContractWalletDetails" (
    "id" STRING NOT NULL,
    "chain" STRING NOT NULL,
    "smartContractWalletId" STRING NOT NULL,
    "deploymentHash" STRING NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartContractWalletDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWalletDetails_deploymentHash_key" ON "SmartContractWalletDetails"("deploymentHash");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWalletDetails_chain_smartContractWalletId_key" ON "SmartContractWalletDetails"("chain", "smartContractWalletId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWallet_creationSalt_key" ON "SmartContractWallet"("creationSalt");

-- AddForeignKey
ALTER TABLE "SmartContractWalletDetails" ADD CONSTRAINT "SmartContractWalletDetails_smartContractWalletId_fkey" FOREIGN KEY ("smartContractWalletId") REFERENCES "SmartContractWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_smartContractWalletDetailsId_fkey" FOREIGN KEY ("smartContractWalletDetailsId") REFERENCES "SmartContractWalletDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
