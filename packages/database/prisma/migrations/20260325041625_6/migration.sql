/*
  Warnings:

  - The `perceived_difficulty` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `gym_facilities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `result` on the `routes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GymFacilityType" AS ENUM ('PARKING', 'SHOWER', 'LOCKER', 'RENTAL', 'CAFE', 'WIFI', 'REST_AREA', 'TRAINING');

-- CreateEnum
CREATE TYPE "GymPerceivedDifficulty" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- CreateEnum
CREATE TYPE "ClimbingAttemptResult" AS ENUM ('SEND', 'ATTEMPT', 'FLASH', 'ONSIGHT');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('FREE', 'TIPS', 'REVIEW', 'MEETUP', 'GEAR');

-- AlterEnum
ALTER TYPE "Difficulty" ADD VALUE 'VB';

-- AlterTable
ALTER TABLE "gym_facilities" DROP COLUMN "type",
ADD COLUMN     "type" "GymFacilityType" NOT NULL;

-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "instagram_id" TEXT,
ADD COLUMN     "price_info" JSONB,
ADD COLUMN     "thumbnail_url" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "category",
ADD COLUMN     "category" "PostCategory" NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "perceived_difficulty",
ADD COLUMN     "perceived_difficulty" "GymPerceivedDifficulty";

-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "perceived_difficulty" "GymPerceivedDifficulty",
DROP COLUMN "result",
ADD COLUMN     "result" "ClimbingAttemptResult" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "home_gym_id" UUID;

-- DropEnum
DROP TYPE "AttemptResult";

-- DropEnum
DROP TYPE "CommunityCategory";

-- DropEnum
DROP TYPE "FacilityType";

-- DropEnum
DROP TYPE "PerceivedDifficulty";

-- CreateTable
CREATE TABLE "gym_difficulty_colors" (
    "id" UUID NOT NULL,
    "gym_id" UUID NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "color" TEXT,
    "label" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gym_difficulty_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "gym_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gym_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_setting_schedules" (
    "id" UUID NOT NULL,
    "gym_id" UUID NOT NULL,
    "interval_days" INTEGER,
    "last_setting_date" DATE,
    "next_setting_date" DATE,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gym_setting_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gym_difficulty_colors_gym_id_difficulty_key" ON "gym_difficulty_colors"("gym_id", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "gym_bookmarks_user_id_gym_id_key" ON "gym_bookmarks"("user_id", "gym_id");

-- CreateIndex
CREATE UNIQUE INDEX "gym_setting_schedules_gym_id_key" ON "gym_setting_schedules"("gym_id");

-- CreateIndex
CREATE UNIQUE INDEX "gym_facilities_gym_id_type_key" ON "gym_facilities"("gym_id", "type");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_home_gym_id_fkey" FOREIGN KEY ("home_gym_id") REFERENCES "gyms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_difficulty_colors" ADD CONSTRAINT "gym_difficulty_colors_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_bookmarks" ADD CONSTRAINT "gym_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_bookmarks" ADD CONSTRAINT "gym_bookmarks_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_setting_schedules" ADD CONSTRAINT "gym_setting_schedules_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
