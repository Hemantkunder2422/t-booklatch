-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "gallery" TEXT[];

-- CreateTable
CREATE TABLE "VenueSpaces" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pax" INTEGER NOT NULL,
    "gallery" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSpaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueSpaces_venueId_idx" ON "VenueSpaces"("venueId");

-- AddForeignKey
ALTER TABLE "VenueSpaces" ADD CONSTRAINT "VenueSpaces_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
