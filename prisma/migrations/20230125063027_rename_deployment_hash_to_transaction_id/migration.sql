/*
  Warnings:

  - You are about to drop the column `deploymentHash` on the `SmartContractWalletDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[openZeppelinTransactionId]` on the table `SmartContractWalletDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `openZeppelinTransactionId` to the `SmartContractWalletDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SmartContractWalletDetails_deploymentHash_key";

-- AlterTable
ALTER TABLE "SmartContractWalletDetails" DROP COLUMN "deploymentHash";
ALTER TABLE "SmartContractWalletDetails" ADD COLUMN     "openZeppelinTransactionId" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWalletDetails_openZeppelinTransactionId_key" ON "SmartContractWalletDetails"("openZeppelinTransactionId");
