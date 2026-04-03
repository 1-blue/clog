import { Difficulty, type Gym, type PrismaClient } from "@prisma/client";

import type { IDifficultyColorSeed } from "./gyms";

// 샘플에 난이도 표가 비어 있을 때만 사용 (정상 시에는 발생하지 않음)
const FALLBACK_COLORS: IDifficultyColorSeed[] = [
  { difficulty: Difficulty.V0, color: "#FFFFFF", label: "흰색", order: 0 },
  { difficulty: Difficulty.V1, color: "#F5D800", label: "노랑", order: 1 },
  { difficulty: Difficulty.V2, color: "#FF7F00", label: "주황", order: 2 },
  { difficulty: Difficulty.V3, color: "#4CAF50", label: "초록", order: 3 },
  { difficulty: Difficulty.V4, color: "#2196F3", label: "파랑", order: 4 },
  { difficulty: Difficulty.V5, color: "#E53935", label: "빨강", order: 5 },
  { difficulty: Difficulty.V6, color: "#E91E8C", label: "분홍", order: 6 },
  { difficulty: Difficulty.V7, color: "#9C27B0", label: "보라", order: 7 },
  { difficulty: Difficulty.V8, color: "#9E9E9E", label: "회색", order: 8 },
  { difficulty: Difficulty.V9, color: "#795548", label: "갈색", order: 9 },
  { difficulty: Difficulty.V10, color: "#212121", label: "검정", order: 10 },
];

export async function seedDifficultyColors(
  prisma: PrismaClient,
  gymMap: Record<string, Gym>,
  colorsByKey: Record<string, IDifficultyColorSeed[]>,
): Promise<void> {
  let total = 0;
  for (const [key, gym] of Object.entries(gymMap)) {
    const colors = colorsByKey[key] ?? FALLBACK_COLORS;
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
