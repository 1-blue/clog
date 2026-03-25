import type { Gym, PrismaClient } from "@prisma/client";

export async function seedSettingSchedules(
  prisma: PrismaClient,
  gyms: Gym[],
): Promise<void> {
  const schedules = [
    { gymIdx: 0, intervalDays: 14, memo: "격주 월요일 세팅" },
    { gymIdx: 1, intervalDays: 21, memo: "3주마다 세팅" },
    { gymIdx: 2, intervalDays: 7, memo: "매주 화요일 세팅" },
    { gymIdx: 3, intervalDays: 14, memo: "격주 수요일 세팅" },
    { gymIdx: 4, intervalDays: 30, memo: "매월 첫째 주 월요일" },
    { gymIdx: 5, intervalDays: 14, memo: "격주 목요일 세팅" },
    { gymIdx: 6, intervalDays: 21, memo: "3주마다 금요일 세팅" },
    { gymIdx: 7, intervalDays: 14, memo: "격주 월요일 세팅" },
    { gymIdx: 8, intervalDays: 21, memo: "3주마다 수요일 세팅" },
    { gymIdx: 9, intervalDays: 30, memo: "매월 둘째 주 화요일" },
  ];

  const now = new Date();
  for (const { gymIdx, intervalDays, memo } of schedules) {
    const lastSettingDate = new Date(now);
    lastSettingDate.setDate(
      now.getDate() - Math.floor(Math.random() * intervalDays),
    );

    const nextSettingDate = new Date(lastSettingDate);
    nextSettingDate.setDate(lastSettingDate.getDate() + intervalDays);

    await prisma.gymSettingSchedule.create({
      data: {
        gymId: gyms[gymIdx]!.id,
        intervalDays,
        lastSettingDate,
        nextSettingDate,
        memo,
      },
    });
  }
  console.log("  ✅ 암장 세팅 일정 생성");
}
