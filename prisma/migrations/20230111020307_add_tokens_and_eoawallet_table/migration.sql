-- CreateTable
CREATE TABLE "Tokens" (
    "id" STRING NOT NULL,
    "contractAddress" STRING NOT NULL,
    "symbol" STRING NOT NULL,
    "name" STRING NOT NULL,
    "logoUri" STRING NOT NULL,
    "chain" DECIMAL(65,30) NOT NULL,
    "decimals" DECIMAL(65,30) NOT NULL,
    "smartContractWalletId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EoaWallet" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" STRING NOT NULL,
    "privateKey" STRING,
    "deviceAuthenticatorId" STRING NOT NULL,

    CONSTRAINT "EoaWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EoaWallet_deviceAuthenticatorId_key" ON "EoaWallet"("deviceAuthenticatorId");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_smartContractWalletId_fkey" FOREIGN KEY ("smartContractWalletId") REFERENCES "SmartContractWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EoaWallet" ADD CONSTRAINT "EoaWallet_deviceAuthenticatorId_fkey" FOREIGN KEY ("deviceAuthenticatorId") REFERENCES "DeviceAuthenticator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
