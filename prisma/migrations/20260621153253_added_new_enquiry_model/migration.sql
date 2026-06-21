/*
  Warnings:

  - The values [ENQUIRY] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ENQUIRY] on the enum `CalendarStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
ALTER TABLE "public"."Booking" ALTER COLUMN "bookingStatus" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "bookingStatus" TYPE "BookingStatus_new" USING ("bookingStatus"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "bookingStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CalendarStatus_new" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED', 'MAINTENANCE');
ALTER TABLE "VenueSpaceCalendar" ALTER COLUMN "status" TYPE "CalendarStatus_new" USING ("status"::text::"CalendarStatus_new");
ALTER TYPE "CalendarStatus" RENAME TO "CalendarStatus_old";
ALTER TYPE "CalendarStatus_new" RENAME TO "CalendarStatus";
DROP TYPE "public"."CalendarStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "VenueSpaceCalendar_venueSpaceId_date_slot_key";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "bookingStatus" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "BookingEnquiry" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "venueSpaceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "eventName" TEXT,
    "eventType" "EventType",
    "bookingDate" DATE NOT NULL,
    "slot" "BookingSlot" NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "source" "BookingSource" NOT NULL DEFAULT 'INTERNAL',
    "pax" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingEnquiry_venueId_idx" ON "BookingEnquiry"("venueId");

-- CreateIndex
CREATE INDEX "BookingEnquiry_bookingDate_idx" ON "BookingEnquiry"("bookingDate");

-- CreateIndex
CREATE INDEX "BookingEnquiry_status_idx" ON "BookingEnquiry"("status");

-- AddForeignKey
ALTER TABLE "BookingEnquiry" ADD CONSTRAINT "BookingEnquiry_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEnquiry" ADD CONSTRAINT "BookingEnquiry_venueSpaceId_fkey" FOREIGN KEY ("venueSpaceId") REFERENCES "VenueSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
