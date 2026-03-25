import type { PrismaClient, User } from "@prisma/client";

export async function seedFollows(
  prisma: PrismaClient,
  users: User[],
): Promise<void> {
  const followPairs = [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 3],
    [2, 0],
    [2, 4],
    [3, 1],
    [3, 2],
    [4, 0],
    [4, 3],
  ] as const;
  await prisma.follow.createMany({
    data: followPairs.map(([a, b]) => ({
      followerId: users[a]!.id,
      followingId: users[b]!.id,
    })),
    skipDuplicates: true,
  });
  console.log("  ✅ 팔로우 관계 생성");
}
