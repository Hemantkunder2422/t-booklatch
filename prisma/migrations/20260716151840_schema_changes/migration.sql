/*
  Warnings:

  - You are about to drop the column `gallery` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `gallery` on the `VenueSpaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "gallery",
ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "openingTime" TEXT;

-- AlterTable
ALTER TABLE "VenueSpaces" DROP COLUMN "gallery";

-- CreateTable
CREATE TABLE "VenueImageGallery" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "venueSpaceId" TEXT,
    "imageKey" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueImageGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueImageGallery_venueId_idx" ON "VenueImageGallery"("venueId");

-- CreateIndex
CREATE INDEX "VenueImageGallery_venueSpaceId_idx" ON "VenueImageGallery"("venueSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueImageGallery_venueId_venueSpaceId_displayOrder_key" ON "VenueImageGallery"("venueId", "venueSpaceId", "displayOrder");

-- AddForeignKey
ALTER TABLE "VenueImageGallery" ADD CONSTRAINT "VenueImageGallery_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueImageGallery" ADD CONSTRAINT "VenueImageGallery_venueSpaceId_fkey" FOREIGN KEY ("venueSpaceId") REFERENCES "VenueSpaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
