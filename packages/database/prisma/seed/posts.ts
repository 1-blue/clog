import type { Post, PrismaClient, User } from "@prisma/client";

export async function seedPosts(
  prisma: PrismaClient,
  users: User[],
): Promise<Post[]> {
  const postData = [
    {
      category: "FREE" as const,
      title: "오늘 처음 클라이밍 해봤는데 너무 재밌어요!",
      content:
        "친구 따라 갔다가 완전 빠져버렸어요. 팔이 다 떨리는데도 또 오르고 싶네요.",
    },
    {
      category: "TIPS" as const,
      title: "V4에서 V5로 넘어가는 팁 공유합니다",
      content:
        "V4까지는 팔힘으로 어떻게든 되는데 V5부터는 발기술이 필수더라고요. 제가 효과 본 방법을 공유합니다.",
    },
    {
      category: "REVIEW" as const,
      title: "더클라임 강남점 새 세팅 후기",
      content:
        "이번 주에 새로 세팅됐는데 V3~V5 구간이 정말 재밌어요. 주말에 가시려면 일찍 가세요!",
    },
    {
      category: "MEETUP" as const,
      title: "이번 주말 홍대점에서 같이 클라이밍하실 분?",
      content:
        "토요일 오후 2시에 클라이밍파크 홍대점에서 클라이밍할 예정입니다. 같이 하실 분 댓글 남겨주세요!",
    },
    {
      category: "GEAR" as const,
      title: "입문용 클라이밍 슈즈 추천",
      content:
        "처음 사는 클라이밍 슈즈인데 어떤 게 좋을까요? 예산은 10만원 정도이고, 볼더링 위주로 하려고 합니다.",
    },
    {
      category: "FREE" as const,
      title: "클라이밍 시작한 지 6개월 후기",
      content:
        "V0에서 시작해서 지금은 V5까지 올라왔어요. 힘들 때도 있었지만 성취감이 정말 대단합니다.",
    },
    {
      category: "TIPS" as const,
      title: "슬로퍼 잡는 법 정리",
      content:
        "핵심은 손바닥 전체로 감싸면서 몸을 홀드 아래로 두는 겁니다. 팔을 쭉 펴고 체중을 발에 실어주세요.",
    },
    {
      category: "REVIEW" as const,
      title: "크럭스 제주점 방문 후기",
      content:
        "제주도 여행 중에 들렀는데 시설이 좋았어요! 여행 오신 클라이머분들은 꼭 한번 가보세요.",
    },
    {
      category: "FREE" as const,
      title: "드디어 V7 완등했습니다!!",
      content:
        "3개월 동안 매달린 문제를 드디어 완등했어요!! 클라이밍 진짜 최고입니다!",
    },
    {
      category: "MEETUP" as const,
      title: "판교 정기 클라이밍 모임 멤버 모집",
      content:
        "매주 수요일 저녁 7시에 스톤브릿지 판교점에서 모이고 있습니다. 실력 무관, 즐겁게 하는 게 목표입니다!",
    },
    {
      category: "TIPS" as const,
      title: "홈트레이닝 루틴 공유",
      content:
        "암장에 못 가는 날에도 실력 향상을 위한 홈트 루틴입니다. 행보드, 풀업, 코어, 스트레칭!",
    },
    {
      category: "GEAR" as const,
      title: "초크백 vs 액체초크, 뭐가 더 좋나요?",
      content:
        "두 가지 다 써봤는데 각각 장단점이 있더라고요. 여러분은 어떤 거 쓰시나요?",
    },
    {
      category: "REVIEW" as const,
      title: "볼더프렌즈 성수점 야간 이용 후기",
      content:
        "평일 저녁 9시 이후에 가면 사람이 적어서 쾌적해요. 세팅이 좀 어려운 편이에요.",
    },
    {
      category: "TIPS" as const,
      title: "클라이밍 전 워밍업 루틴",
      content:
        "부상 방지를 위한 워밍업이 정말 중요해요! 조깅 → 동적 스트레칭 → 쉬운 문제 순서로 하세요.",
    },
    {
      category: "FREE" as const,
      title: "클라이밍 후 근육통 관리법",
      content:
        "폼롤러와 스트레칭이 정말 도움이 됩니다. 특히 전완근 스트레칭은 필수!",
    },
  ];

  const posts: Post[] = [];
  for (let i = 0; i < postData.length; i++) {
    const post = await prisma.post.create({
      data: {
        authorId: users[i % 5]!.id,
        ...postData[i]!,
        tags: i % 2 === 0 ? ["볼더링", "클라이밍"] : ["초보"],
      },
    });
    posts.push(post);
  }
  console.log(`  ✅ ${posts.length}개의 게시글 생성`);

  return posts;
}
