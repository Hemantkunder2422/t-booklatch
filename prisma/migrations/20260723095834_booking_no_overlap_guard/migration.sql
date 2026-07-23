-- Database-level double-booking guard.
--
-- Rejects two "live" bookings for the same venue space + date whose time ranges
-- overlap. This complements (does not replace) the pg_advisory_xact_lock +
-- overlap check in BookingsService: the app lock avoids the error under normal
-- concurrency, this constraint is the last line of defence.
--
-- Semantics mirror the app query exactly:
--   same venueSpaceId, same bookingDate, [startTime, endTime) ranges overlap,
--   and only for statuses that still hold the slot.
--
-- startTime/endTime are TIMESTAMP(3) (no time zone) -> tsrange.
-- Equality operators (=) on venueSpaceId/bookingDate inside a GiST exclusion
-- constraint require the btree_gist extension.

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
ADD CONSTRAINT "booking_no_overlap"
EXCLUDE USING gist (
    "venueSpaceId" WITH =,
    "bookingDate" WITH =,
    tsrange("startTime", "endTime") WITH &&
)
WHERE ("bookingStatus" IN ('PENDING', 'BOOKING_IN_PROGRESS', 'LOCKED', 'CONFIRMED'));
