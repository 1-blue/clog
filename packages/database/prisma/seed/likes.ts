import type { Post, PrismaClient, User } from "@prisma/client";

export async function seedPostLikes(
  prisma: PrismaClient,
  posts: Post[],
  users: User[],
): Promise<void> {
  for (let i = 0; i < posts.length; i++) {
    const numLikes = Math.floor(Math.random() * 4);
    for (let j = 0; j < numLikes; j++) {
      try {
        await prisma.postLike.create({
          data: { postId: posts[i]!.id, userId: users[j % 5]!.id },
        });
      } catch {
        // 중복 무시
      }
    }
  }
  console.log("  ✅ 좋아요 생성");
}
