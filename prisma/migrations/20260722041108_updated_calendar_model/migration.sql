/*
  Warnings:

  - You are about to drop the column `slot` on the `BookingEnquiry` table. All the data in the column will be lost.
  - You are about to drop the column `slot` on the `VenueSpaceCalendar` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `BookingEnquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `BookingEnquiry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `VenueSpaceCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `VenueSpaceCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingEnquiry" DROP COLUMN "slot",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VenueSpaceCalendar" DROP COLUMN "slot",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "BookingSlot";
