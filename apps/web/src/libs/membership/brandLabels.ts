import {
  gymMembershipBrandToKoreanMap,
  type GymMembershipBrand,
} from "@clog/contracts";

export const gymMembershipBrandLabel = (brand: GymMembershipBrand): string =>
  gymMembershipBrandToKoreanMap[brand];
