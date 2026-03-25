import type { Gym, PrismaClient, User } from "@prisma/client";

export async function seedGymBookmarks(
  prisma: PrismaClient,
  users: User[],
  gyms: Gym[],
): Promise<void> {
  const bookmarkPairs: [number, number[]][] = [
    [0, [0, 2, 5]],
    [1, [0, 1, 3]],
    [2, [2, 4]],
    [3, [1, 5, 9]],
    [4, [0, 6]],
  ];

  for (const [userIdx, gymIndices] of bookmarkPairs) {
    for (const gymIdx of gymIndices) {
      await prisma.gymBookmark.create({
        data: {
          userId: users[userIdx]!.id,
          gymId: gyms[gymIdx]!.id,
        },
      });
    }
  }
  console.log("  ✅ 암장 북마크 생성");
}
