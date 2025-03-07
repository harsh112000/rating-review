/*
  Warnings:

  - You are about to drop the column `customerId` on the `CustomerCustomer` table. All the data in the column will be lost.
  - Added the required column `parentCustomerId` to the `CustomerCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomerCustomer" DROP CONSTRAINT "CustomerCustomer_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_customerId_fkey";

-- AlterTable
ALTER TABLE "CustomerCustomer" DROP COLUMN "customerId",
ADD COLUMN     "parentCustomerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerCustomer" ADD CONSTRAINT "CustomerCustomer_parentCustomerId_fkey" FOREIGN KEY ("parentCustomerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
