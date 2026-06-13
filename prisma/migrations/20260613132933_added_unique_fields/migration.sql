/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Venue_ownerId_key" ON "Venue"("ownerId");
