/*
  Warnings:

  - A unique constraint covering the columns `[userId,log_date]` on the table `daily_nutrition_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "daily_nutrition_logs_userId_log_date_key" ON "daily_nutrition_logs"("userId", "log_date");
