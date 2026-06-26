-- #4: track who created a booking
ALTER TABLE "Booking" ADD COLUMN "createdById" TEXT;

CREATE INDEX "Booking_createdById_idx" ON "Booking"("createdById");

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- #2: replace the unconditional unique constraint with a partial unique index
-- so that CANCELLED bookings no longer occupy the slot and it can be re-booked.
DROP INDEX "Booking_venueSpaceId_bookingDate_slot_key";

CREATE UNIQUE INDEX "uq_booking_active_slot"
  ON "Booking"("venueSpaceId", "bookingDate", "slot")
  WHERE "bookingStatus" <> 'CANCELLED';

-- plain index kept for the existence/lookup query (Prisma-managed)
CREATE INDEX "Booking_venueSpaceId_bookingDate_slot_idx"
  ON "Booking"("venueSpaceId", "bookingDate", "slot");
