import type { Gym, PrismaClient } from "@prisma/client";

export async function seedFacilities(
  prisma: PrismaClient,
  gyms: Gym[],
): Promise<void> {
  const facilityData: { gymIndex: number; types: string[] }[] = [
    { gymIndex: 0, types: ["PARKING", "SHOWER", "LOCKER", "CAFE", "RENTAL"] },
    { gymIndex: 1, types: ["CAFE", "WIFI", "REST_AREA", "RENTAL"] },
    { gymIndex: 2, types: ["SHOWER", "LOCKER", "TRAINING", "RENTAL"] },
    { gymIndex: 3, types: ["PARKING", "SHOWER", "LOCKER", "CAFE"] },
    {
      gymIndex: 4,
      types: ["PARKING", "SHOWER", "LOCKER", "TRAINING", "REST_AREA"],
    },
    { gymIndex: 5, types: ["SHOWER", "LOCKER", "RENTAL", "WIFI"] },
    { gymIndex: 6, types: ["PARKING", "SHOWER", "CAFE", "REST_AREA"] },
    { gymIndex: 7, types: ["PARKING", "SHOWER", "LOCKER"] },
    { gymIndex: 8, types: ["PARKING", "SHOWER", "LOCKER", "CAFE", "TRAINING"] },
    { gymIndex: 9, types: ["PARKING", "RENTAL", "REST_AREA"] },
  ];

  for (const fd of facilityData) {
    for (const type of fd.types) {
      await prisma.gymFacility.create({
        data: { gymId: gyms[fd.gymIndex]!.id, type: type as never },
      });
    }
  }
  console.log("  ✅ 암장 시설 생성");
}
