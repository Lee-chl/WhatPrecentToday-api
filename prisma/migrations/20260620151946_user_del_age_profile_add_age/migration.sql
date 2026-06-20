/*
  Warnings:

  - You are about to drop the column `age` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 20;
