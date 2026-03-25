import type { PrismaClient, User } from "@prisma/client";

export type SeededUsers = {
  users: User[];
  admin: User;
  manager: User;
  user1: User;
  user2: User;
  user3: User;
};

export async function seedUsers(prisma: PrismaClient): Promise<SeededUsers> {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@clog.kr" },
      update: {},
      create: {
        email: "admin@clog.kr",
        nickname: "클로그관리자",
        bio: "클로그 서비스 관리자입니다",
        role: "ADMIN",
        maxDifficulty: "V8",
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@clog.kr" },
      update: {},
      create: {
        email: "manager@clog.kr",
        nickname: "볼더링마스터",
        bio: "클라이밍 5년차, 다양한 암장을 다니고 있어요",
        role: "MANAGER",
        maxDifficulty: "V7",
      },
    }),
    prisma.user.upsert({
      where: { email: "user1@clog.kr" },
      update: {},
      create: {
        email: "user1@clog.kr",
        nickname: "초보클라이머",
        bio: "클라이밍 시작한지 3개월! 재밌어요",
        role: "GUEST",
        maxDifficulty: "V3",
      },
    }),
    prisma.user.upsert({
      where: { email: "user2@clog.kr" },
      update: {},
      create: {
        email: "user2@clog.kr",
        nickname: "암벽여행자",
        bio: "전국 암장 탐방 중",
        role: "GUEST",
        maxDifficulty: "V5",
      },
    }),
    prisma.user.upsert({
      where: { email: "user3@clog.kr" },
      update: {},
      create: {
        email: "user3@clog.kr",
        nickname: "손가락힘왕",
        bio: "핑거보드가 친구입니다",
        role: "GUEST",
        maxDifficulty: "V6",
      },
    }),
  ]);

  const [admin, manager, user1, user2, user3] = users;
  console.log(`  ✅ ${users.length}명의 유저 생성`);

  return { users, admin, manager, user1, user2, user3 };
}
