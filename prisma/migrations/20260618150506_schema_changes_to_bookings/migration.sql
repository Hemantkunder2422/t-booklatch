/*
  Warnings:

  - You are about to drop the column `endDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[venueSpaceId,date,slot]` on the table `VenueSpaceCalendar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot` to the `VenueSpaceCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingSlot" AS ENUM ('MORNING', 'EVENING', 'FULL_DAY');

-- DropIndex
DROP INDEX "Booking_endDate_idx";

-- DropIndex
DROP INDEX "Booking_startDate_idx";

-- DropIndex
DROP INDEX "VenueSpaceCalendar_venueSpaceId_date_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "bookingDate" DATE NOT NULL,
ADD COLUMN     "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "slot" "BookingSlot" NOT NULL DEFAULT 'MORNING';

-- AlterTable
ALTER TABLE "VenueSpaceCalendar" ADD COLUMN     "slot" "BookingSlot" NOT NULL;

-- AlterTable
ALTER TABLE "VenueSpaces" ADD COLUMN     "eveningSlotEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fullDaySlotEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "morningSlotEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "VenueSpaceCalendar_venueSpaceId_date_slot_key" ON "VenueSpaceCalendar"("venueSpaceId", "date", "slot");
