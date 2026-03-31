import type { Difficulty, Gym, PrismaClient } from "@prisma/client";

interface IColorEntry {
  difficulty: Difficulty;
  color: string;
  label: string;
  order: number;
}

// 더클라임: V0~V10 (11단계)
const THE_CLIMB_COLORS: IColorEntry[] = [
  { difficulty: "V0", color: "#FFFFFF", label: "흰색", order: 0 },
  { difficulty: "V1", color: "#F5D800", label: "노랑", order: 1 },
  { difficulty: "V2", color: "#FF7F00", label: "주황", order: 2 },
  { difficulty: "V3", color: "#4CAF50", label: "초록", order: 3 },
  { difficulty: "V4", color: "#2196F3", label: "파랑", order: 4 },
  { difficulty: "V5", color: "#E53935", label: "빨강", order: 5 },
  { difficulty: "V6", color: "#E91E8C", label: "분홍", order: 6 },
  { difficulty: "V7", color: "#9C27B0", label: "보라", order: 7 },
  { difficulty: "V8", color: "#9E9E9E", label: "회색", order: 8 },
  { difficulty: "V9", color: "#795548", label: "갈색", order: 9 },
  { difficulty: "V10", color: "#212121", label: "검정", order: 10 },
];

// 서울숲클라이밍: V1~V10 (10단계)
const SEOULFOREST_COLORS: IColorEntry[] = [
  { difficulty: "V1", color: "#FF69B4", label: "분홍", order: 0 },
  { difficulty: "V2", color: "#E53935", label: "빨강", order: 1 },
  { difficulty: "V3", color: "#FF7F00", label: "주황", order: 2 },
  { difficulty: "V4", color: "#F5D800", label: "노랑", order: 3 },
  { difficulty: "V5", color: "#4CAF50", label: "초록", order: 4 },
  { difficulty: "V6", color: "#2196F3", label: "파랑", order: 5 },
  { difficulty: "V7", color: "#1A237E", label: "남색", order: 6 },
  { difficulty: "V8", color: "#9C27B0", label: "보라", order: 7 },
  { difficulty: "V9", color: "#795548", label: "갈색", order: 8 },
  { difficulty: "V10", color: "#212121", label: "검정", order: 9 },
];

// 클라이밍파크: V2~V10 (9단계)
const CLIMBINGPARK_COLORS: IColorEntry[] = [
  { difficulty: "V2", color: "#F5D800", label: "노랑", order: 0 },
  { difficulty: "V3", color: "#FF69B4", label: "분홍", order: 1 },
  { difficulty: "V4", color: "#2196F3", label: "파랑", order: 2 },
  { difficulty: "V5", color: "#E53935", label: "빨강", order: 3 },
  { difficulty: "V6", color: "#9C27B0", label: "보라", order: 4 },
  { difficulty: "V7", color: "#795548", label: "갈색", order: 5 },
  { difficulty: "V8", color: "#9E9E9E", label: "회색", order: 6 },
  { difficulty: "V9", color: "#212121", label: "검정", order: 7 },
  { difficulty: "V10", color: "#FFFFFF", label: "흰색", order: 8 },
];

const GYM_COLOR_MAP: Record<string, IColorEntry[]> = {
  theclimb_yeonnam: THE_CLIMB_COLORS,
  theclimb_b_hongdae: THE_CLIMB_COLORS,
  theclimb_ilsan: THE_CLIMB_COLORS,
  theclimb_magok: THE_CLIMB_COLORS,
  theclimb_yangjae: THE_CLIMB_COLORS,
  theclimb_sillim: THE_CLIMB_COLORS,
  theclimb_gangnam: THE_CLIMB_COLORS,
  theclimb_sadang: THE_CLIMB_COLORS,
  theclimb_sinsa: THE_CLIMB_COLORS,
  theclimb_nonhyeon: THE_CLIMB_COLORS,
  theclimb_mullae: THE_CLIMB_COLORS,
  theclimb_isu: THE_CLIMB_COLORS,
  theclimb_seongsu: THE_CLIMB_COLORS,
  seoulforest_jongno: SEOULFOREST_COLORS,
  seoulforest_jamsil: SEOULFOREST_COLORS,
  seoulforest_yeongdeungpo: SEOULFOREST_COLORS,
  seoulforest_guro: SEOULFOREST_COLORS,
  climbingpark_gangnam: CLIMBINGPARK_COLORS,
  climbingpark_sinnonhyeon: CLIMBINGPARK_COLORS,
  climbingpark_hanti: CLIMBINGPARK_COLORS,
  climbingpark_seongsu: CLIMBINGPARK_COLORS,
  climbingpark_jongno: CLIMBINGPARK_COLORS,
};

export async function seedDifficultyColors(
  prisma: PrismaClient,
  gymMap: Record<string, Gym>,
): Promise<void> {
  let total = 0;
  for (const [key, gym] of Object.entries(gymMap)) {
    const colors = GYM_COLOR_MAP[key] ?? THE_CLIMB_COLORS;
    await prisma.gymDifficultyColor.createMany({
      data: colors.map(({ difficulty, color, label, order }) => ({
        gymId: gym.id,
        difficulty,
        color,
        label,
        order,
      })),
    });
    total += colors.length;
  }
  console.log(`  ✅ ${total}개의 난이도 색상 매핑 생성`);
}
