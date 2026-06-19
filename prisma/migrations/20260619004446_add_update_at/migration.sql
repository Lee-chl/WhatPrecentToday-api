-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Foods" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "daily_nutrition_logs" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "intake_logs" ALTER COLUMN "updateAt" DROP DEFAULT;
