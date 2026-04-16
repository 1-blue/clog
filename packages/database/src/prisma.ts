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

  /**
   * PrismaPg는 내부적으로 node-pg Pool을 쓴다. Vercel 등 서버리스에서는
   * 인스턴스(람다)마다 풀이 생기므로, 풀당 최대 연결을 1로 두는 것이 안전하다.
   * (여러 PrismaClient 인스턴스가 생기면 풀 max × 인스턴스 수만큼 PgBouncer에 붙는다)
   */
  const adapter = new PrismaPg({
    connectionString,
    max: 1,
  });
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
    globalForPrisma.prisma ??= createPrismaClient();
    return Reflect.get(globalForPrisma.prisma, prop, receiver);
  },
});
