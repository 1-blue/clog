import type { Gym, PrismaClient } from "@prisma/client";

export async function seedCongestionLogs(
  prisma: PrismaClient,
  gyms: Gym[],
): Promise<void> {
  for (const gym of gyms) {
    for (let day = 0; day < 7; day++) {
      for (let hour = 6; hour <= 23; hour++) {
        let base = 20;
        if (day >= 1 && day <= 5) {
          if (hour >= 18 && hour <= 21) base = 70;
          else if (hour >= 12 && hour <= 14) base = 40;
        } else {
          if (hour >= 14 && hour <= 18) base = 75;
          else if (hour >= 10 && hour <= 13) base = 50;
        }
        const congestion = Math.min(
          100,
          Math.max(0, base + Math.floor(Math.random() * 20 - 10)),
        );
        await prisma.gymCongestionLog.create({
          data: { gymId: gym.id, dayOfWeek: day, hour, congestion },
        });
      }
    }
  }
  console.log("  ✅ 혼잡도 로그 생성");
}
