/**
 * Public API 응답 스키마(contracts).
 *
 * 현재는 기존 수동 OpenAPI 스키마와의 1:1 정합을 맞추기 전 단계로,
 * 도메인별 파일로 확장할 수 있는 엔트리만 마련한다.
 */
export * from "./gyms";
export * from "./users.shared";
export * from "./users";
export * from "./records";
export * from "./posts";
export * from "./comments";
export * from "./notifications";
export * from "./reviews";
