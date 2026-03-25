import type { Gym, PrismaClient, User } from "@prisma/client";

import {
  SESSION_CLOCK_HOUR_MAX,
  SESSION_CLOCK_HOUR_MIN,
  SESSION_MINUTE_OPTIONS,
  normalizeSessionTimeRange,
} from "@clog/utils";

const PERCEIVED_DIFFICULTIES = ["EASY", "NORMAL", "HARD"] as const;

export async function seedClimbingSessions(
  prisma: PrismaClient,
  users: User[],
  gyms: Gym[],
): Promise<void> {
  const difficulties = [
    "VB",
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
  ] as const;
  const results = ["SEND", "ATTEMPT", "FLASH", "ONSIGHT"] as const;

  for (let i = 0; i < 30; i++) {
    const userIdx = i % 5;
    const gymIdx = i % 10;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    date.setHours(0, 0, 0, 0);

    const startH =
      SESSION_CLOCK_HOUR_MIN +
      Math.floor(
        Math.random() *
          (SESSION_CLOCK_HOUR_MAX - SESSION_CLOCK_HOUR_MIN - 2 + 1),
      );
    const startM =
      SESSION_MINUTE_OPTIONS[
        Math.floor(Math.random() * SESSION_MINUTE_OPTIONS.length)
      ]!;
    const startTotal = startH * 60 + startM;
    const spanHalfHours = 1 + Math.floor(Math.random() * 5);
    const endTotalRaw = startTotal + spanHalfHours * 30;
    const { startMinutes, endMinutes } = normalizeSessionTimeRange(
      startTotal,
      endTotalRaw,
    );

    const y = date.getFullYear();
    const mo = date.getMonth();
    const d = date.getDate();
    const startTime = new Date(y, mo, d, Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
    const endTime = new Date(y, mo, d, Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

    const routeCount = 3 + Math.floor(Math.random() * 5);
    await prisma.climbingSession.create({
      data: {
        userId: users[userIdx]!.id,
        gymId: gyms[gymIdx]!.id,
        date,
        startTime,
        endTime,
        memo:
          i % 3 === 0
            ? "오늘 컨디션 좋았다!"
            : i % 3 === 1
              ? "새로운 세팅이 재밌었음"
              : undefined,
        isPublic: i % 5 !== 0,
        routes: {
          create: Array.from({ length: routeCount }, (_, j) => ({
            difficulty:
              difficulties[
                Math.min(userIdx * 2 + Math.floor(Math.random() * 3), 9)
              ]!,
            result: results[Math.floor(Math.random() * 4)]!,
            attempts: 1 + Math.floor(Math.random() * 3),
            perceivedDifficulty:
              Math.random() > 0.5
                ? PERCEIVED_DIFFICULTIES[
                    Math.floor(Math.random() * PERCEIVED_DIFFICULTIES.length)
                  ]
                : undefined,
            order: j,
          })),
        },
      },
    });
  }
  console.log("  ✅ 30개의 클라이밍 세션 생성");
}
