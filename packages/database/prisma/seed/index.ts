import "./load-env";

import { prisma } from "../../src/index";
import { seedComments } from "./comments";
import { seedDifficultyColors } from "./difficulty-colors";
import { seedFollows } from "./follows";
import { seedGymBookmarks } from "./gym-bookmarks";
import { seedGyms } from "./gyms";
import { seedPostLikes } from "./likes";
import { seedNotifications } from "./notifications";
import { seedPosts } from "./posts";
import { seedReviews } from "./reviews";
import { seedClimbingSessions } from "./sessions";
import { seedSettingSchedules } from "./setting-schedules";
import { seedUsers } from "./users";

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  const { users, admin, manager, user1, user2, user3 } =
    await seedUsers(prisma);
  const gymMap = await seedGyms(prisma);
  const gyms = Object.values(gymMap);

  await seedDifficultyColors(prisma, gymMap);
  await seedSettingSchedules(prisma, gymMap);
  await seedClimbingSessions(prisma, users, gyms);
  await seedReviews(prisma, users, gyms);
  await seedGymBookmarks(prisma, users, gyms);

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

  // 유저 홈짐 설정
  await prisma.user.update({
    where: { id: admin.id },
    data: { homeGymId: gymMap["theclimb_yeonnam"]!.id },
  });
  await prisma.user.update({
    where: { id: manager.id },
    data: { homeGymId: gymMap["theclimb_b_hongdae"]!.id },
  });
  await prisma.user.update({
    where: { id: user1.id },
    data: { homeGymId: gymMap["seoulforest_jongno"]!.id },
  });
  await prisma.user.update({
    where: { id: user2.id },
    data: { homeGymId: gymMap["climbingpark_gangnam"]!.id },
  });
  await prisma.user.update({
    where: { id: user3.id },
    data: { homeGymId: gymMap["theclimb_seongsu"]!.id },
  });
  console.log("  ✅ 유저 홈짐 설정 완료");

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
