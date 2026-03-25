import path from "node:path";
import { defineConfig } from "prisma/config";

// Node 22+ 내장 .env 로더
process.loadEnvFile(path.join(__dirname, ".env"));

// 마이그레이션·reset·push·introspect 등 Prisma CLI는 이 url을 사용합니다.
// Supabase: Transaction pooler(6543, pgbouncer)는 DDL/마이그레이션에서 멈추거나 실패할 수 있어,
// 대시보드 "Direct connection"(보통 5432, db.xxx.supabase.co) URI를 DIRECT_URL에 두는 것을 권장합니다.
// 앱 런타임(@clog/db PrismaClient)은 계속 DATABASE_URL(풀러)을 쓰면 됩니다.
const datasourceUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: datasourceUrl,
  },
  migrations: {
    seed: "npx tsx prisma/seed/index.ts",
  },
});
