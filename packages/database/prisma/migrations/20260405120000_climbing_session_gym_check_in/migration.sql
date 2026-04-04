-- AlterTable
ALTER TABLE "climbing_sessions" ADD COLUMN "gym_check_in_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "climbing_sessions_gym_check_in_id_key" ON "climbing_sessions"("gym_check_in_id");

-- AddForeignKey
ALTER TABLE "climbing_sessions" ADD CONSTRAINT "climbing_sessions_gym_check_in_id_fkey" FOREIGN KEY ("gym_check_in_id") REFERENCES "gym_check_ins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
