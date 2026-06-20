/*
  Warnings:

  - You are about to alter the column `calorie` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `carbohydrate` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `protein` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `fat` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `sodium` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `NUTRI_AMOUNT_SERVING` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `SERVING_SIZE` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `total_capacity` on the `Foods` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `calorie` on the `daily_nutrition_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `carbohydrate` on the `daily_nutrition_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `protein` on the `daily_nutrition_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `fat` on the `daily_nutrition_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `sodium` on the `daily_nutrition_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `intake` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `calorie` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `carbohydrate` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `protein` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `fat` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `sodium` on the `intake_logs` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Foods" ALTER COLUMN "calorie" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sodium" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "NUTRI_AMOUNT_SERVING" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "SERVING_SIZE" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "total_capacity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "daily_nutrition_logs" ALTER COLUMN "calorie" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sodium" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "intake_logs" ALTER COLUMN "intake" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "calorie" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "carbohydrate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "fat" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sodium" SET DATA TYPE DECIMAL(10,2);
