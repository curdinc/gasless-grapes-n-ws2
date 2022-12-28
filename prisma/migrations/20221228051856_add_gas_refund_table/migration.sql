-- CreateTable
CREATE TABLE "GasRefund" (
    "id" STRING NOT NULL,
    "accessCode" STRING NOT NULL,
    "walletAddress" STRING NOT NULL,
    "tranasctions" STRING[],
    "email" STRING NOT NULL,

    CONSTRAINT "GasRefund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GasRefund_accessCode_key" ON "GasRefund"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "GasRefund_walletAddress_key" ON "GasRefund"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "GasRefund_email_key" ON "GasRefund"("email");
