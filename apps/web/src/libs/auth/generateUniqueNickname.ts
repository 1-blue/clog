import { prisma } from "@clog/db/prisma";

const ADJECTIVES = [
  "심연의",
  "악마 같은",
  "은밀한",
  "긴고아의",
  "깊은 밤의",
  "부유한 밤의",
  "성급한",
  "타락한",
  "번개의",
  "정오의",
  "가장 오래된",
  "가장 어두운 봄의",
  "헤매는",
  "재앙의",
  "우중충한 밤바다의",
  "붉은 코스모스의",
  "굳센",
  "돌진하는",
  "드러누운",
  "연기 나는",
  "지고한 빛의",
  "외눈의",
  "죽음을 노래하는",
  "현명한",
  "물병자리에 핀",
  "젊은이와 여행의",
  "정의와 화목의",
  "신을 마주보는",
  "무저갱의",
  "흙으로 사람을 빚은",
  "절름발이",
  "초승달의",
  "강령의",
  "검은 갈기의",
  "눈먼 왕의",
  "아비도스의",
  "대지의",
  "해역의 경계를 긋는",
  "천둥과 전쟁의",
  "술과 황홀경의",
  "우주의 순환을 책임지는",
  "모두의 것인",
] as const;

const NOUNS = [
  "심판자",
  "흑염룡",
  "죄수",
  "모략가",
  "전신",
  "포식자",
  "군주",
  "해방자",
  "수호자",
  "서기관",
  "지배자",
  "필경사",
  "사냥꾼",
  "공포",
  "괴물",
  "요정",
  "점성술사",
  "여왕",
  "지휘관",
  "폭풍",
  "거암",
  "드래곤",
  "전사",
  "예언자",
  "침략자",
  "창조자",
  "파괴자",
  "방랑자",
  "왕",
  "사자",
] as const;

// 42 × 30 = 1,260가지
const TOTAL_COMBINATIONS = ADJECTIVES.length * NOUNS.length;

const pickRandom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

const generateCandidate = (): string =>
  `${pickRandom(ADJECTIVES)} ${pickRandom(NOUNS)}`;

const MAX_ATTEMPTS = 12;

export const generateUniqueNickname = async (): Promise<string> => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const nickname = generateCandidate();
    const taken = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true },
    });
    if (!taken) return nickname;
  }
  // 1,260개 풀 소진 시 fallback — 기존 방식으로 전환
  throw new Error(
    `고유 닉네임을 만들 수 없습니다. (풀 크기: ${TOTAL_COMBINATIONS})`,
  );
};
