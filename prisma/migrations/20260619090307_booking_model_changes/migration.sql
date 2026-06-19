/*
  Warnings:

  - A unique constraint covering the columns `[venueSpaceId,bookingDate,slot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('INTERNAL', 'PHONE', 'WHATSAPP', 'CUSTOMER_APP');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'ENQUIRY';

-- AlterEnum
ALTER TYPE "CalendarStatus" ADD VALUE 'ENQUIRY';

-- DropIndex
DROP INDEX "Booking_venueSpaceId_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "source" "BookingSource" NOT NULL DEFAULT 'INTERNAL',
ALTER COLUMN "bookingStatus" SET DEFAULT 'ENQUIRY';

-- CreateIndex
CREATE INDEX "Booking_venueSpaceId_bookingDate_idx" ON "Booking"("venueSpaceId", "bookingDate");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_venueSpaceId_bookingDate_slot_key" ON "Booking"("venueSpaceId", "bookingDate", "slot");
