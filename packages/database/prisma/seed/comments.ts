import type { Post, PrismaClient, User } from "@prisma/client";

export async function seedComments(
  prisma: PrismaClient,
  posts: Post[],
  users: User[],
): Promise<void> {
  const commentTexts = [
    "좋은 글이네요! 도움이 됐어요",
    "저도 같은 경험이 있어요 ㅋㅋ",
    "오 대단하시네요! 저도 열심히 해야겠어요",
    "궁금했던 건데 감사합니다!",
    "다음에 같이 가요!",
    "저도 추천합니다!",
    "화이팅이에요!!",
    "좋은 정보 감사합니다~",
  ];

  for (let i = 0; i < posts.length; i++) {
    const numComments = 1 + Math.floor(Math.random() * 4);
    for (let j = 0; j < numComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          postId: posts[i]!.id,
          authorId: users[(i + j + 1) % 5]!.id,
          content: commentTexts[(i + j) % commentTexts.length]!,
        },
      });

      if (j === 0 && Math.random() > 0.5) {
        await prisma.comment.create({
          data: {
            postId: posts[i]!.id,
            authorId: users[(i + j + 2) % 5]!.id,
            parentId: comment.id,
            content: "맞아요~ 공감합니다!",
          },
        });
      }
    }

    const count = await prisma.comment.count({
      where: { postId: posts[i]!.id },
    });
    const likes = Math.floor(Math.random() * 5);
    await prisma.post.update({
      where: { id: posts[i]!.id },
      data: { commentCount: count, likeCount: likes },
    });
  }
  console.log("  ✅ 댓글 생성");
}
