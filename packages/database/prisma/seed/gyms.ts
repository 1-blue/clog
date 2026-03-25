import type { Gym, Prisma, PrismaClient } from "@prisma/client";

const defaultOpenHours: Prisma.InputJsonValue = {
  lines: ["월–금 10:00 – 24:00", "토·일 09:00 – 22:00"],
};

export async function seedGyms(prisma: PrismaClient): Promise<Gym[]> {
  const gymsData = [
    {
      name: "더클라임 강남점",
      address: "서울시 강남구 역삼동 123-4",
      region: "SEOUL" as const,
      phone: "02-1234-5678",
      congestion: 75,
      visitorCount: 72,
      latitude: 37.5012,
      longitude: 127.0396,
      description:
        "강남 최대 규모의 볼더링 전문 암장. 초보자부터 고수까지 다양한 난이도의 문제를 제공합니다.",
      avgRating: 4.5,
      reviewCount: 0,
    },
    {
      name: "클라이밍파크 홍대점",
      address: "서울시 마포구 서교동 456-7",
      region: "SEOUL" as const,
      phone: "02-2345-6789",
      congestion: 45,
      visitorCount: 48,
      latitude: 37.5563,
      longitude: 126.9237,
      description: "홍대 인근 감성 볼더링 공간. 카페와 함께 운영됩니다.",
      avgRating: 4.2,
      reviewCount: 0,
    },
    {
      name: "볼더프렌즈 성수점",
      address: "서울시 성동구 성수동 789-0",
      region: "SEOUL" as const,
      phone: "02-3456-7890",
      congestion: 85,
      visitorCount: 88,
      latitude: 37.5445,
      longitude: 127.0559,
      description:
        "성수동 핫플레이스 볼더링장. 세팅이 자주 바뀌어 매번 새로운 도전!",
      avgRating: 4.7,
      reviewCount: 0,
    },
    {
      name: "스톤브릿지 판교점",
      address: "경기도 성남시 분당구 판교로 111",
      region: "GYEONGGI" as const,
      phone: "031-1234-5678",
      congestion: 30,
      visitorCount: 28,
      latitude: 37.3947,
      longitude: 127.1112,
      description: "판교 테크노밸리 직장인들의 퇴근 후 놀이터",
      avgRating: 4.3,
      reviewCount: 0,
    },
    {
      name: "그래비티 일산점",
      address: "경기도 고양시 일산서구 탄현로 222",
      region: "GYEONGGI" as const,
      phone: "031-2345-6789",
      congestion: 20,
      visitorCount: 18,
      latitude: 37.6761,
      longitude: 126.7514,
      description: "일산 최초 리드+볼더링 복합 클라이밍센터",
      avgRating: 4.1,
      reviewCount: 0,
    },
    {
      name: "더월 서면점",
      address: "부산시 부산진구 서면로 333",
      region: "BUSAN" as const,
      phone: "051-1234-5678",
      congestion: 55,
      visitorCount: 52,
      latitude: 35.1579,
      longitude: 129.0596,
      description: "부산 서면 중심가의 프리미엄 볼더링장",
      avgRating: 4.4,
      reviewCount: 0,
    },
    {
      name: "클라임온 해운대점",
      address: "부산시 해운대구 해운대로 444",
      region: "BUSAN" as const,
      phone: "051-2345-6789",
      congestion: 40,
      visitorCount: 41,
      latitude: 35.1587,
      longitude: 129.1604,
      description: "해운대 바다가 보이는 클라이밍 센터",
      avgRating: 4.6,
      reviewCount: 0,
    },
    {
      name: "피크볼더링 대전점",
      address: "대전시 서구 둔산동 555",
      region: "DAEJEON" as const,
      phone: "042-1234-5678",
      congestion: 35,
      visitorCount: 33,
      latitude: 36.3519,
      longitude: 127.3846,
      description: "대전 둔산동 볼더링 전문 암장",
      avgRating: 4.0,
      reviewCount: 0,
    },
    {
      name: "센드잇 인천점",
      address: "인천시 연수구 송도동 666",
      region: "INCHEON" as const,
      phone: "032-1234-5678",
      congestion: 60,
      visitorCount: 59,
      latitude: 37.3809,
      longitude: 126.6569,
      description: "송도 신도시의 대형 클라이밍 센터",
      avgRating: 4.3,
      reviewCount: 0,
    },
    {
      name: "크럭스 제주점",
      address: "제주시 노형동 777",
      region: "JEJU" as const,
      phone: "064-1234-5678",
      congestion: 15,
      visitorCount: 14,
      latitude: 33.489,
      longitude: 126.4983,
      description: "제주도 유일의 볼더링 전문 암장. 여행 중 클라이밍!",
      avgRating: 4.8,
      reviewCount: 0,
    },
  ];

  const gyms: Gym[] = [];
  for (const gymData of gymsData) {
    const gym = await prisma.gym.create({
      data: { ...gymData, openHours: defaultOpenHours },
    });
    gyms.push(gym);
  }
  console.log(`  ✅ ${gyms.length}개의 암장 생성`);

  return gyms;
}
