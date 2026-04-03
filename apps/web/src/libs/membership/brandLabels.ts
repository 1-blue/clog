import {
  gymMembershipBrandToKoreanMap,
  type GymMembershipBrand,
} from "@clog/utils";

export const gymMembershipBrandLabel = (brand: GymMembershipBrand): string =>
  gymMembershipBrandToKoreanMap[brand];
