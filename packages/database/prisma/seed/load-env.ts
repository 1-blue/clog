import path from "node:path";
import { fileURLToPath } from "node:url";

// tsx 실행 시 cwd가 달라질 수 있어 __dirname 기준으로 .env 로드
const dir = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(dir, "../..", ".env"));
