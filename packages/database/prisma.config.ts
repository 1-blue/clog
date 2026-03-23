import path from "node:path";
import { defineConfig } from "prisma/config";

// TODO: 환경변수 Supabase PostgreSQL 연결 URL (Supabase 대시보드 > Settings > Database에서 확인)
export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrate: {
    url: process.env.DIRECT_URL ?? "",
  },
  studio: {
    url: process.env.DIRECT_URL ?? "",
  },
});
