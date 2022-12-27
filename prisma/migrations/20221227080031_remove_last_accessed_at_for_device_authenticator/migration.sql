/*
  Warnings:

  - You are about to drop the column `lastAccessedAt` on the `DeviceAuthenticator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceAuthenticator" DROP COLUMN "lastAccessedAt";
