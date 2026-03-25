import type { Gym, PrismaClient } from "@prisma/client";

const DEFAULT_COLORS: {
  difficulty: string;
  color: string | null;
  label: string;
}[] = [
  { difficulty: "VB", color: "#FFFFFF", label: "흰색" },
  { difficulty: "V0", color: "#FFFFFF", label: "흰색" },
  { difficulty: "V1", color: "#F5DC4C", label: "노란색" },
  { difficulty: "V2", color: "#F0A830", label: "주황색" },
  { difficulty: "V3", color: "#5ABF72", label: "초록색" },
  { difficulty: "V4", color: "#3A9EE0", label: "파란색" },
  { difficulty: "V5", color: "#E05555", label: "빨간색" },
  { difficulty: "V6", color: "#A040C0", label: "보라색" },
  { difficulty: "V7", color: "#8B5E3C", label: "갈색" },
  { difficulty: "V8", color: "#888888", label: "회색" },
  { difficulty: "V9", color: "#111111", label: "검정" },
  { difficulty: "V10", color: "#111111", label: "검정" },
  { difficulty: "V_PLUS", color: null, label: "특별표식" },
];

export async function seedDifficultyColors(
  prisma: PrismaClient,
  gyms: Gym[],
): Promise<void> {
  for (const gym of gyms) {
    for (let i = 0; i < DEFAULT_COLORS.length; i++) {
      const { difficulty, color, label } = DEFAULT_COLORS[i]!;
      await prisma.gymDifficultyColor.create({
        data: {
          gymId: gym.id,
          difficulty: difficulty as never,
          color,
          label,
          order: i,
        },
      });
    }
  }
  console.log(
    `  ✅ ${gyms.length * DEFAULT_COLORS.length}개의 난이도 색상 매핑 생성`,
  );
}
