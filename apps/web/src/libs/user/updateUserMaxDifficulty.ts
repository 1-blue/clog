import type { Difficulty } from "@clog/db";
import { prisma } from "@clog/db/prisma";

import {
  isDifficultyStrictlyHigher,
  maxDifficultyFromRoutes,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";

/** 기록 세션 루트 기준으로 유저 최고 난이도 상향 (필요 시에만) */
export const bumpUserMaxDifficultyFromRoutes = async (
  userId: string,
  routes: { difficulty: string }[],
): Promise<void> => {
  const sessionMax = maxDifficultyFromRoutes(routes);
  if (!sessionMax) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { maxDifficulty: true },
  });
  if (!user) return;

  if (
    isDifficultyStrictlyHigher(
      sessionMax,
      user.maxDifficulty as Difficulty | null,
    )
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: { maxDifficulty: sessionMax },
    });
  }
};

/** 모든 공개/비공개 기록 루트를 스캔해 최고 난이도 재계산 (삭제 후 등) */
export const recomputeUserMaxDifficulty = async (
  userId: string,
): Promise<void> => {
  const routes = await prisma.climbingRoute.findMany({
    where: { session: { userId } },
    select: { difficulty: true },
  });
  const max = maxDifficultyFromRoutes(routes);
  await prisma.user.update({
    where: { id: userId },
    data: { maxDifficulty: max },
  });
};
