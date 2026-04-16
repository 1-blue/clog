import "./load-env";

import { prisma } from "../../src/prisma";
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
import { seedUsers } from "./users";

const SEED_PROFILE = (process.env.SEED_PROFILE ?? "dev").toLowerCase();

async function seedProdGymsOnly() {
  console.log("🌱 시드 프로파일: prod (암장 데이터만)");
  const { gymMap, difficultyColorsByKey } = await seedGyms(prisma);
  await seedDifficultyColors(prisma, gymMap, difficultyColorsByKey);
  console.log("\n🎉 prod 시드 완료");
}

async function seedDevFull() {
  console.log("🌱 시드 프로파일: dev (풀 시드)");
  const { users, admin, manager, user1, user2, user3 } =
    await seedUsers(prisma);
  const { gymMap, difficultyColorsByKey } = await seedGyms(prisma);
  const gyms = Object.values(gymMap);

  await seedDifficultyColors(prisma, gymMap, difficultyColorsByKey);
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
    data: { homeGymId: gymMap["seoulforest_jongro"]!.id },
  });
  await prisma.user.update({
    where: { id: user2.id },
    data: { homeGymId: gymMap["climbing_park_gangnam"]!.id },
  });
  await prisma.user.update({
    where: { id: user3.id },
    data: { homeGymId: gymMap["theclimb_seongsu"]!.id },
  });
  console.log("  ✅ 유저 홈짐 설정 완료");

  console.log("\n🎉 dev 시드 완료");
}

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  if (SEED_PROFILE === "prod") {
    await seedProdGymsOnly();
  } else if (SEED_PROFILE === "dev") {
    await seedDevFull();
  } else {
    throw new Error(
      `SEED_PROFILE는 dev 또는 prod 여야 합니다. (현재: ${SEED_PROFILE})`,
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
