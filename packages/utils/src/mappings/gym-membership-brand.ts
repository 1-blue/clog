import type { GymMembershipBrand } from "../schemas/enums";

/** 회원권 브랜드(체인) 한글 표시 */
export const gymMembershipBrandToKoreanMap: Record<GymMembershipBrand, string> =
  {
    THE_CLIMB: "더클라임",
    SEOULFOREST: "서울숲클라이밍",
    CLIMBINGPARK: "클라이밍파크",
    STANDALONE: "단독 암장",
  };
