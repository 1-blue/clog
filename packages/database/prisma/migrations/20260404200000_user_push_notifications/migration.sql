-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ANDROID');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "push_notifications_enabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "user_push_devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expo_push_token" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_push_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_push_devices_user_id_expo_push_token_key" ON "user_push_devices"("user_id", "expo_push_token");

-- CreateIndex
CREATE INDEX "user_push_devices_user_id_idx" ON "user_push_devices"("user_id");

-- AddForeignKey
ALTER TABLE "user_push_devices" ADD CONSTRAINT "user_push_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
