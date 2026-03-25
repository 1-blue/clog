/*
  Warnings:

  - Changed the type of `feature` on the `review_features` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PerceivedDifficulty" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- CreateEnum
CREATE TYPE "GymReviewFeature" AS ENUM ('COOL_AIR', 'WIDE_STRETCH', 'VARIOUS_LEVEL', 'KIND_STAFF', 'EASY_PARKING', 'SHOWER_ROOM', 'CLEAN_FACILITY', 'GOOD_VENT');

-- AlterTable
ALTER TABLE "review_features" DROP COLUMN "feature",
ADD COLUMN     "feature" "GymReviewFeature" NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "perceived_difficulty" "PerceivedDifficulty";
