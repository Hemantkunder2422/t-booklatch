/*
  Warnings:

  - The values [VENDOR_ADMIN,VENDOR_STAFF,VENUE_ADMIN,VENUE_STAFF,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [VENDOR,VENUE] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isUsed` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Venue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteType` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('TENANT_OWNER', 'TENANT_USER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('VENUE', 'VENDOR');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'SUPPORT', 'OWNER', 'MANAGER', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "Invite" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('ADMIN', 'TENANT');
ALTER TABLE "User" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TABLE "Invite" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_venueId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_venueId_fkey";

-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Venue" DROP CONSTRAINT "Venue_ownerId_fkey";

-- DropIndex
DROP INDEX "Subscription_venueId_key";

-- DropIndex
DROP INDEX "User_vendorId_idx";

-- DropIndex
DROP INDEX "User_venueId_idx";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "isUsed",
DROP COLUMN "vendorId",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "inviteType" "InviteType" NOT NULL,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "tenantName" TEXT,
ADD COLUMN     "tenantType" "TenantType",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "venueId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "maxSpace" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxUser" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "maxVenue" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "venueId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "ownerId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "TenantType" NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVenue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "assignedById" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserVenue_userId_idx" ON "UserVenue"("userId");

-- CreateIndex
CREATE INDEX "UserVenue_venueId_idx" ON "UserVenue"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVenue_userId_venueId_key" ON "UserVenue"("userId", "venueId");

-- CreateIndex
CREATE INDEX "Invite_email_idx" ON "Invite"("email");

-- CreateIndex
CREATE INDEX "Invite_tenantId_idx" ON "Invite"("tenantId");

-- CreateIndex
CREATE INDEX "Invite_status_idx" ON "Invite"("status");

-- CreateIndex
CREATE INDEX "Invite_inviteType_idx" ON "Invite"("inviteType");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tenantId_key" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVenue" ADD CONSTRAINT "UserVenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVenue" ADD CONSTRAINT "UserVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVenue" ADD CONSTRAINT "UserVenue_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
