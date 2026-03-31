import type { Gym, PrismaClient } from "@prisma/client";

interface IScheduleSeed {
  gymKey: string;
  intervalDays: number;
  memo: string;
}

const SCHEDULES: IScheduleSeed[] = [
  { gymKey: "theclimb_yeonnam", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_b_hongdae", intervalDays: 7, memo: "홍대B 독자 세팅 주기" },
  { gymKey: "theclimb_ilsan", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_magok", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_yangjae", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_sillim", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_gangnam", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_sadang", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_sinsa", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_nonhyeon", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_mullae", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_isu", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "theclimb_seongsu", intervalDays: 7, memo: "매주 월·목 세팅" },
  { gymKey: "seoulforest_jongno", intervalDays: 7, memo: "매주 세팅" },
  { gymKey: "seoulforest_jamsil", intervalDays: 7, memo: "매주 세팅" },
  { gymKey: "seoulforest_yeongdeungpo", intervalDays: 7, memo: "매주 세팅" },
  { gymKey: "seoulforest_guro", intervalDays: 7, memo: "매주 세팅" },
  { gymKey: "climbingpark_gangnam", intervalDays: 14, memo: "격주 세팅" },
  { gymKey: "climbingpark_sinnonhyeon", intervalDays: 14, memo: "격주 세팅" },
  { gymKey: "climbingpark_hanti", intervalDays: 14, memo: "격주 세팅" },
  { gymKey: "climbingpark_seongsu", intervalDays: 14, memo: "격주 세팅" },
  {
    gymKey: "climbingpark_jongno",
    intervalDays: 7,
    memo: "매주 화요일 세팅 (전체세팅 월 1회)",
  },
];

export async function seedSettingSchedules(
  prisma: PrismaClient,
  gymMap: Record<string, Gym>,
): Promise<void> {
  const now = new Date();
  for (const { gymKey, intervalDays, memo } of SCHEDULES) {
    const gym = gymMap[gymKey];
    if (!gym) continue;

    const lastSettingDate = new Date(now);
    lastSettingDate.setDate(
      now.getDate() - Math.floor(Math.random() * intervalDays),
    );

    const nextSettingDate = new Date(lastSettingDate);
    nextSettingDate.setDate(lastSettingDate.getDate() + intervalDays);

    await prisma.gymSettingSchedule.create({
      data: {
        gymId: gym.id,
        intervalDays,
        lastSettingDate,
        nextSettingDate,
        memo,
      },
    });
  }
  console.log("  ✅ 암장 세팅 일정 생성");
}
