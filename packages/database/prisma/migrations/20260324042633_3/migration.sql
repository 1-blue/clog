-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "visitor_capacity" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "check_in_auto_duration_minutes" INTEGER NOT NULL DEFAULT 240;

-- CreateTable
CREATE TABLE "gym_check_ins" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "gym_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "gym_check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gym_check_ins_gym_id_ended_at_ends_at_idx" ON "gym_check_ins"("gym_id", "ended_at", "ends_at");

-- CreateIndex
CREATE INDEX "gym_check_ins_user_id_ended_at_ends_at_idx" ON "gym_check_ins"("user_id", "ended_at", "ends_at");

-- AddForeignKey
ALTER TABLE "gym_check_ins" ADD CONSTRAINT "gym_check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_check_ins" ADD CONSTRAINT "gym_check_ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
