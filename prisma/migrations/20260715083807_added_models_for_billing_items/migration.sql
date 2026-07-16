-- CreateEnum
CREATE TYPE "InvoiceLineItemCategory" AS ENUM ('VENUE_RENT', 'CATERING', 'DECORATION', 'PARKING', 'OTHERS');

-- CreateTable
CREATE TABLE "BillingLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptId" TEXT,
    "description" TEXT NOT NULL,
    "category" "InvoiceLineItemCategory" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "taxPercentage" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BillingLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillingLineItem_invoiceId_idx" ON "BillingLineItem"("invoiceId");

-- CreateIndex
CREATE INDEX "BillingLineItem_receiptId_idx" ON "BillingLineItem"("receiptId");

-- AddForeignKey
ALTER TABLE "BillingLineItem" ADD CONSTRAINT "BillingLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingLineItem" ADD CONSTRAINT "BillingLineItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
