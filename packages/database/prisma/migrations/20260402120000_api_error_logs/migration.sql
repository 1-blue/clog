-- CreateTable
CREATE TABLE "api_error_logs" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "error_log" TEXT NOT NULL,
    "user_id" UUID,
    "http_status" INTEGER,
    "client_message" TEXT,
    "error_name" TEXT,
    "trace_id" TEXT,

    CONSTRAINT "api_error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "api_error_logs_created_at_idx" ON "api_error_logs"("created_at");

-- CreateIndex
CREATE INDEX "api_error_logs_user_id_idx" ON "api_error_logs"("user_id");

-- AddForeignKey
ALTER TABLE "api_error_logs" ADD CONSTRAINT "api_error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
