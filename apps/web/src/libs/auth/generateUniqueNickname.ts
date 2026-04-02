import { prisma } from "@clog/db";

const NICKNAME_PREFIX = "클로거";
const SUFFIX_LEN = 6;
const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const MAX_ATTEMPTS = 12;

const randomSuffix = (): string => {
  let s = "";
  for (let i = 0; i < SUFFIX_LEN; i++) {
    s += CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  }
  return s;
};

/** `클로거` + 랜덤 접미 — DB 유니크 충돌 시 재시도 */
export const generateUniqueNickname = async (): Promise<string> => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const nickname = `${NICKNAME_PREFIX}${randomSuffix()}`;
    const taken = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true },
    });
    if (!taken) return nickname;
  }
  throw new Error("고유 닉네임을 만들 수 없습니다.");
};
