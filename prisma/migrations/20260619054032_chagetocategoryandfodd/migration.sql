/*
  Warnings:

  - You are about to drop the column `foodId` on the `Categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_foodId_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "foodId";

-- AlterTable
ALTER TABLE "Foods" ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Foods" ADD CONSTRAINT "Foods_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
