-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Man', 'Woman');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "calorie" INTEGER NOT NULL,
    "carbohydrate" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "sodium" INTEGER NOT NULL,
    "NUTRI_AMOUNT_SERVING" INTEGER NOT NULL,
    "SERVING_SIZE" INTEGER NOT NULL,
    "total_capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "foodId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "calorie_goal" INTEGER NOT NULL DEFAULT 2000,
    "carbohydrate_goal" INTEGER NOT NULL DEFAULT 250,
    "protein_goal" INTEGER NOT NULL DEFAULT 100,
    "fat_goal" INTEGER NOT NULL DEFAULT 65,
    "sodium_goal" INTEGER NOT NULL DEFAULT 2000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_nutrition_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "calorie" INTEGER NOT NULL,
    "carbohydrate" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "sodium" INTEGER NOT NULL,
    "log_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_nutrition_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intake_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "intake" INTEGER NOT NULL,
    "calorie" INTEGER NOT NULL,
    "carbohydrate" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "sodium" INTEGER NOT NULL,
    "eaten_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intake_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_nutrition_logs_userId_key" ON "daily_nutrition_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "intake_logs_userId_key" ON "intake_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "intake_logs_foodId_key" ON "intake_logs"("foodId");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_nutrition_logs" ADD CONSTRAINT "daily_nutrition_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intake_logs" ADD CONSTRAINT "intake_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intake_logs" ADD CONSTRAINT "intake_logs_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
