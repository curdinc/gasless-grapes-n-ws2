-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING,
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "imageUrl" STRING,
    "userChallengeId" STRING,

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
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" STRING NOT NULL,

    CONSTRAINT "DeviceAuthenticator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" STRING NOT NULL,
    "challenge" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "UserChallenge_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "UserChallenge_userId_key" ON "UserChallenge"("userId");

-- AddForeignKey
ALTER TABLE "DeviceAuthenticator" ADD CONSTRAINT "DeviceAuthenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallenge" ADD CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
