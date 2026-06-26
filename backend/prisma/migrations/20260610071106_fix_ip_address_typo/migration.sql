/*
  Warnings:

  - You are about to drop the column `idAddress` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "idAddress",
ADD COLUMN     "ipAddress" TEXT;
