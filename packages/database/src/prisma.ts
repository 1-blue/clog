import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL 환경 변수가 필요합니다.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

/**
 * Prisma 싱글톤 — 접근 시점에 lazy 하게 생성해 DATABASE_URL 없는 빌드 스크립트
 * (예: openapi 생성) 에서도 모듈 import 가 실패하지 않도록 한다.
 *
 * NOTE: 이 모듈은 Node.js 런타임(서버)에서만 import 해야 한다.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const instance = globalForPrisma.prisma ?? createPrismaClient();
    if (process.env.NODE_ENV !== "production")
      globalForPrisma.prisma = instance;
    return Reflect.get(instance, prop, receiver);
  },
});
