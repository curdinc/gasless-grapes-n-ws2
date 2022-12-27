/*
  Warnings:

  - You are about to drop the column `creationDate` on the `DeviceAuthenticator` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessDate` on the `DeviceAuthenticator` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `DeviceAuthenticator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceAuthenticator" DROP COLUMN "creationDate";
ALTER TABLE "DeviceAuthenticator" DROP COLUMN "lastAccessDate";
ALTER TABLE "DeviceAuthenticator" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "DeviceAuthenticator" ADD COLUMN     "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "DeviceAuthenticator" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserChallenge" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "UserChallenge" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
