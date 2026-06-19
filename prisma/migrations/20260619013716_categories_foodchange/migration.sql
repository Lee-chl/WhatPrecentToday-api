-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_foodId_fkey";

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "foodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
