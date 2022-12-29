/*
  Warnings:

  - You are about to drop the `UserWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserWallet" DROP CONSTRAINT "UserWallet_userId_fkey";

-- DropTable
DROP TABLE "UserWallet";

-- CreateTable
CREATE TABLE "UserSmartContractWallet" (
    "id" STRING NOT NULL,
    "creationHash" STRING NOT NULL,
    "address" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "UserSmartContractWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSmartContractWallet_creationHash_key" ON "UserSmartContractWallet"("creationHash");

-- CreateIndex
CREATE UNIQUE INDEX "UserSmartContractWallet_address_key" ON "UserSmartContractWallet"("address");

-- AddForeignKey
ALTER TABLE "UserSmartContractWallet" ADD CONSTRAINT "UserSmartContractWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
