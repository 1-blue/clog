import type { PrismaClient, User } from "@prisma/client";

export async function seedNotifications(
  prisma: PrismaClient,
  seeded: {
    admin: User;
    manager: User;
    user1: User;
    user2: User;
    user3: User;
  },
): Promise<void> {
  const { admin, manager, user1, user2, user3 } = seeded;

  const notifications = [
    {
      userId: user1.id,
      type: "POST_COMMENT" as const,
      title: "게시글에 댓글",
      message: "볼더링마스터님이 댓글을 남겼습니다.",
    },
    {
      userId: user1.id,
      type: "LIKE" as const,
      title: "좋아요",
      message: "암벽여행자님이 게시글을 좋아합니다.",
    },
    {
      userId: user2.id,
      type: "FOLLOW" as const,
      title: "새 팔로워",
      message: "초보클라이머님이 팔로우했습니다.",
    },
    {
      userId: user3.id,
      type: "SYSTEM" as const,
      title: "공지",
      message: "새로운 기능이 추가되었습니다!",
    },
    {
      userId: admin.id,
      type: "GYM_UPDATE" as const,
      title: "암장 업데이트",
      message: "더클라임 강남점의 새로운 세팅이 등록되었습니다.",
    },
    {
      userId: manager.id,
      type: "LIKE" as const,
      title: "좋아요",
      message: "3명이 게시글을 좋아합니다.",
    },
    {
      userId: user2.id,
      type: "SYSTEM" as const,
      title: "이벤트",
      message: "주말 클라이밍 챌린지에 참여해보세요!",
    },
    {
      userId: user1.id,
      type: "COMMENT_REPLY" as const,
      title: "내 댓글에 답글",
      message: "손가락힘왕님이 답글을 남겼습니다.",
    },
    {
      userId: user1.id,
      type: "AUTO_CHECKOUT" as const,
      title: "자동 체크아웃",
      message: "더클라임 강남점에서 체크인 시간이 종료되어 자동 체크아웃되었습니다.",
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }
  console.log("  ✅ 알림 생성");
}
