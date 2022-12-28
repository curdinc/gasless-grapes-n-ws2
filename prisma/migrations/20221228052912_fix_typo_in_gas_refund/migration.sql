/*
  Warnings:

  - You are about to drop the column `tranasctions` on the `GasRefund` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GasRefund" DROP COLUMN "tranasctions";
ALTER TABLE "GasRefund" ADD COLUMN     "transactions" STRING[];
