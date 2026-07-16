/*
  Warnings:

  - You are about to drop the column `slot` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_venueSpaceId_bookingDate_slot_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "slot",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6);

-- CreateIndex
CREATE INDEX "Venue_latitude_longitude_idx" ON "Venue"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "VenueSpaceCalendar_bookingId_idx" ON "VenueSpaceCalendar"("bookingId");

-- AddForeignKey
ALTER TABLE "VenueSpaceCalendar" ADD CONSTRAINT "VenueSpaceCalendar_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
