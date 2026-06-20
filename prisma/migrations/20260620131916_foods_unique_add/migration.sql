/*
  Warnings:

  - A unique constraint covering the columns `[brandName,name]` on the table `Foods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Foods_brandName_name_key" ON "Foods"("brandName", "name");
