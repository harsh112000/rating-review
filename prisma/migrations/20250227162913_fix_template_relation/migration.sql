-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_customerId_fkey";

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
