-- DropIndex
DROP INDEX "VenueSpaces_venueId_idx";

-- CreateIndex
CREATE INDEX "VenueSpaces_venueId_name_idx" ON "VenueSpaces"("venueId", "name");
