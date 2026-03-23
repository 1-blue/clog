import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 시드 데이터
  console.log("시드 데이터 생성 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
