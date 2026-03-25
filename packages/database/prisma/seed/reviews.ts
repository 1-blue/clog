import {
  GymReviewFeature,
  type Gym,
  type PrismaClient,
  type User,
} from "@prisma/client";

const FEATURE_POOL = [
  GymReviewFeature.CLEAN_FACILITY,
  GymReviewFeature.VARIOUS_LEVEL,
  GymReviewFeature.KIND_STAFF,
  GymReviewFeature.COOL_AIR,
  GymReviewFeature.EASY_PARKING,
  GymReviewFeature.GOOD_VENT,
] as const;

export async function seedReviews(
  prisma: PrismaClient,
  users: User[],
  gyms: Gym[],
): Promise<number> {
  const reviewTexts = [
    "시설이 정말 깔끔하고 세팅이 다양해서 좋아요. 초보자도 즐길 수 있는 난이도가 많아요!",
    "스태프분들이 친절하고 루트 세팅이 자주 바뀌어서 질리지 않아요. 주말에 좀 붐비는 편이에요.",
    "주차가 편하고 샤워시설도 좋아요. 매트도 두꺼워서 안전해요. 카페도 있어서 쉬기 좋아요.",
    "난이도 분포가 골고루 있어서 다양한 레벨의 클라이머가 즐길 수 있어요.",
    "위치가 좋고 시설이 넓어요. 환기도 잘 돼서 쾌적해요. 자주 올 것 같아요!",
  ];

  let reviewCount = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const gymIdx = (i * 2 + j) % 10;
      const count = 1 + Math.floor(Math.random() * 3);
      const shuffled = [...FEATURE_POOL].sort(() => Math.random() - 0.5);
      const features = shuffled.slice(0, count);

      await prisma.review.create({
        data: {
          userId: users[i]!.id,
          gymId: gyms[gymIdx]!.id,
          rating: 3 + Math.floor(Math.random() * 3),
          content: reviewTexts[(i + j) % reviewTexts.length]!,
          features,
        },
      });
      reviewCount++;
    }
  }

  for (const gym of gyms) {
    const agg = await prisma.review.aggregate({
      where: { gymId: gym.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.gym.update({
      where: { id: gym.id },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
    });
  }
  console.log(`  ✅ ${reviewCount}개의 리뷰 생성`);

  return reviewCount;
}
