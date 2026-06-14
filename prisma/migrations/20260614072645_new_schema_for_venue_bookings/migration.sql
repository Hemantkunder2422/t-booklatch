/*
  Warnings:

  - You are about to drop the column `emai` on the `Vendor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'BIRTHDAY', 'OTHERS', 'RECEPTION', 'CORPORATE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CalendarStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "emai",
ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "venueSpaceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "pax" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSpaceCalendar" (
    "id" TEXT NOT NULL,
    "venueSpaceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "CalendarStatus" NOT NULL,
    "notes" TEXT,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSpaceCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_venueSpaceId_idx" ON "Booking"("venueSpaceId");

-- CreateIndex
CREATE INDEX "Booking_startDate_idx" ON "Booking"("startDate");

-- CreateIndex
CREATE INDEX "Booking_endDate_idx" ON "Booking"("endDate");

-- CreateIndex
CREATE INDEX "VenueSpaceCalendar_venueSpaceId_date_idx" ON "VenueSpaceCalendar"("venueSpaceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "VenueSpaceCalendar_venueSpaceId_date_key" ON "VenueSpaceCalendar"("venueSpaceId", "date");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_venueSpaceId_fkey" FOREIGN KEY ("venueSpaceId") REFERENCES "VenueSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSpaceCalendar" ADD CONSTRAINT "VenueSpaceCalendar_venueSpaceId_fkey" FOREIGN KEY ("venueSpaceId") REFERENCES "VenueSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
