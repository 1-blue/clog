import "./load-env";

import { prisma } from "../../src/index";
import { seedComments } from "./comments";
import { seedCongestionLogs } from "./congestion";
import { seedFacilities } from "./facilities";
import { seedFollows } from "./follows";
import { seedGyms } from "./gyms";
import { seedPostLikes } from "./likes";
import { seedNotifications } from "./notifications";
import { seedPosts } from "./posts";
import { seedReviews } from "./reviews";
import { seedClimbingSessions } from "./sessions";
import { seedUsers } from "./users";

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  const { users, admin, manager, user1, user2, user3 } =
    await seedUsers(prisma);
  const gyms = await seedGyms(prisma);

  await seedFacilities(prisma, gyms);
  await seedCongestionLogs(prisma, gyms);
  await seedClimbingSessions(prisma, users, gyms);
  await seedReviews(prisma, users, gyms);

  const posts = await seedPosts(prisma, users);
  await seedComments(prisma, posts, users);
  await seedPostLikes(prisma, posts, users);
  await seedFollows(prisma, users);
  await seedNotifications(prisma, {
    admin,
    manager,
    user1,
    user2,
    user3,
  });

  console.log("\n🎉 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
