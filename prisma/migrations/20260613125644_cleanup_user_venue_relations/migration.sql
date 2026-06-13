/*
  Warnings:

  - You are about to drop the column `userId` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Venue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_userId_fkey";

-- DropIndex
DROP INDEX "Venue_ownerId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnBoarded" BOOLEAN;

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "userId",
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "long" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "userId";
