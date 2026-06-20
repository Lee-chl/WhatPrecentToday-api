/*
  Warnings:

  - A unique constraint covering the columns `[userId,foodId,eaten_at]` on the table `intake_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "intake_logs_foodId_key";

-- DropIndex
DROP INDEX "intake_logs_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "intake_logs_userId_foodId_eaten_at_key" ON "intake_logs"("userId", "foodId", "eaten_at");
