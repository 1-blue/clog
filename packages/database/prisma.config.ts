import path from "node:path";
import { defineConfig } from "prisma/config";

// vercel 빌드 에러때문에 수정
// 로컬에만 .env가 있고, Vercel 등 CI에는 없으므로 없으면 그냥 스킵
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  // .env 파일 없으면 환경변수(process.env)를 그대로 사용
}

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
