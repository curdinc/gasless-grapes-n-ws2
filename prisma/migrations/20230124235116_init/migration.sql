-- CreateTable
CREATE TABLE "GasRefund" (
    "id" STRING NOT NULL,
    "accessCode" STRING NOT NULL,
    "walletAddress" STRING,
    "transactions" STRING[],
    "email" STRING,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GasRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "handle" STRING NOT NULL,
    "name" STRING,
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "imageUrl" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAuthenticator" (
    "id" STRING NOT NULL,
    "deviceName" STRING NOT NULL,
    "credentialId" STRING NOT NULL,
    "credentialPublicKey" STRING NOT NULL,
    "counter" INT4 NOT NULL,
    "credentialDeviceType" STRING NOT NULL,
    "credentialBackedUp" BOOL NOT NULL,
    "rawAttestation" STRING NOT NULL,
    "transports" STRING[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "DeviceAuthenticator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartContractWallet" (
    "id" STRING NOT NULL,
    "creationSalt" STRING NOT NULL,
    "creationEoa" STRING NOT NULL,
    "address" STRING NOT NULL,
    "type" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "SmartContractWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartContractWalletDetails" (
    "id" STRING NOT NULL,
    "chain" STRING NOT NULL,
    "smartContractWalletId" STRING NOT NULL,
    "deploymentHash" STRING NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartContractWalletDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" STRING NOT NULL,
    "contractAddress" STRING NOT NULL,
    "symbol" STRING NOT NULL,
    "name" STRING NOT NULL,
    "logoUri" STRING NOT NULL,
    "chain" DECIMAL(65,30) NOT NULL,
    "decimals" DECIMAL(65,30) NOT NULL,
    "smartContractWalletDetailsId" STRING NOT NULL,
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
CREATE UNIQUE INDEX "GasRefund_accessCode_key" ON "GasRefund"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "GasRefund_walletAddress_key" ON "GasRefund"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "GasRefund_email_key" ON "GasRefund"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuthenticator_credentialId_key" ON "DeviceAuthenticator"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuthenticator_credentialPublicKey_key" ON "DeviceAuthenticator"("credentialPublicKey");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuthenticator_credentialId_credentialPublicKey_key" ON "DeviceAuthenticator"("credentialId", "credentialPublicKey");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuthenticator_userId_deviceName_key" ON "DeviceAuthenticator"("userId", "deviceName");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWallet_creationSalt_key" ON "SmartContractWallet"("creationSalt");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWallet_address_key" ON "SmartContractWallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWalletDetails_deploymentHash_key" ON "SmartContractWalletDetails"("deploymentHash");

-- CreateIndex
CREATE UNIQUE INDEX "SmartContractWalletDetails_chain_smartContractWalletId_key" ON "SmartContractWalletDetails"("chain", "smartContractWalletId");

-- CreateIndex
CREATE UNIQUE INDEX "EoaWallet_deviceAuthenticatorId_key" ON "EoaWallet"("deviceAuthenticatorId");

-- AddForeignKey
ALTER TABLE "DeviceAuthenticator" ADD CONSTRAINT "DeviceAuthenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmartContractWallet" ADD CONSTRAINT "SmartContractWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmartContractWalletDetails" ADD CONSTRAINT "SmartContractWalletDetails_smartContractWalletId_fkey" FOREIGN KEY ("smartContractWalletId") REFERENCES "SmartContractWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_smartContractWalletDetailsId_fkey" FOREIGN KEY ("smartContractWalletDetailsId") REFERENCES "SmartContractWalletDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EoaWallet" ADD CONSTRAINT "EoaWallet_deviceAuthenticatorId_fkey" FOREIGN KEY ("deviceAuthenticatorId") REFERENCES "DeviceAuthenticator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
