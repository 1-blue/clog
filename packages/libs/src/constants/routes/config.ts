import type { RoutePath, RouteKey } from "./routes";

/**
 * + 접근 권한 레벨
 * 1. `public`: 모든 사용자 접근 가능
 * 2. `authenticated`: 인증된 사용자만 접근 가능
 * 3. `unauthenticated`: 인증되지 않은 사용자만 접근 가능
 * 4. `admin`: 관리자만 접근 가능
 */
export type AccessLevel =
  | "public"
  | "authenticated"
  | "unauthenticated"
  | "admin";

/**
 * 라우트별 접근 권한 설정
 * RouteKey 타입을 사용하여 타입 안전성 보장
 */
export const routeAccess: Partial<Record<RouteKey, AccessLevel>> = {
  // 관리자 전용
  admin: "admin",
  "admin.community": "admin",
  "admin.contact": "admin",
  "admin.gyms": "admin",
  "admin.users": "admin",

  // 인증되지 않은 사용자만 접근 가능
  login: "unauthenticated",
  signup: "unauthenticated",

  // 공개 접근 가능
  home: "public",
  community: "public",
  "community.detail": "public",
  contact: "public",
  crowd: "public",
  gyms: "public",
  "gyms.detail": "public",
  "info.climbing": "public",
  "info.grades": "public",

  // 인증된 사용자만 접근 가능
  "community.create": "authenticated",
  "community.edit": "authenticated",
  "contact.create": "authenticated",
  "contact.edit": "authenticated",
  "gyms.edit": "authenticated",
  passes: "authenticated",
  profile: "authenticated",
  "profile.edit": "authenticated",
  records: "authenticated",
  "records.detail": "authenticated",
  "records.create": "authenticated",
  "records.edit": "authenticated",
  settings: "authenticated",
  stats: "authenticated",
};

/**
 * 라우트 키로 접근 권한 확인
 */
export const getRouteAccess = (key: RouteKey): AccessLevel => {
  return routeAccess[key] ?? "public";
};

/**
 * 라우트 접근 가능 여부 확인
 */
export const canAccessRoute = (
  key: RouteKey,
  isAuthenticated: boolean,
  userRole?: string
) => {
  const accessLevel = getRouteAccess(key);

  switch (accessLevel) {
    case "public":
      return true;
    case "authenticated":
      return isAuthenticated;
    case "unauthenticated":
      return !isAuthenticated;
    case "admin":
      return isAuthenticated && userRole === "admin";
    default:
      return false;
  }
};
