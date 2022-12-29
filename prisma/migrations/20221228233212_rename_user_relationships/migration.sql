/*
  Warnings:

  - You are about to drop the `UserSmartContractWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSmartContractWallet" DROP CONSTRAINT "UserSmartContractWallet_userId_fkey";

-- DropTable
DROP TABLE "UserSmartContractWallet";

-- CreateTable
CREATE TABLE "SmartContractWallet" (
    "id" STRING NOT NULL,
    "creationHash" STRING NOT NULL,
    "address" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployedAt" TIMESTAMP(3),
    "type" STRING NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "SmartContractWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWallet_creationHash_key" ON "SmartContractWallet"("creationHash");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWallet_address_key" ON "SmartContractWallet"("address");

-- AddForeignKey
ALTER TABLE "SmartContractWallet" ADD CONSTRAINT "SmartContractWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
