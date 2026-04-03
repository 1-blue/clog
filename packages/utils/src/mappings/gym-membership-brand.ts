import type { GymMembershipBrand } from "../schemas/enums";

/** 회원권 브랜드(체인) 한글 표시 */
export const gymMembershipBrandToKoreanMap: Record<GymMembershipBrand, string> =
  {
    THE_CLIMB: "더클라임",
    SEOULFOREST: "서울숲클라이밍",
    CLIMBINGPARK: "클라이밍파크",
    SONCLIMB: "손클라임",
    PEAKERS: "피커스",
    WAVEROCK: "웨이브락",
    CLIMB_US: "클라임어스",
    DAMJANG: "담장",
    B_BLOC: "비블럭",
    ALLEZ: "알레클라임",
    STANDALONE: "단독 암장",
  };
