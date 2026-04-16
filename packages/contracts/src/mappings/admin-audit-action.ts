import type { AdminAuditAction } from "../schemas/enums";

/** 어드민 감사 로그 액션을 한글로 맵핑 */
export const adminAuditActionToKoreanMap: Record<AdminAuditAction, string> = {
  CREATE: "생성",
  UPDATE: "수정",
  DELETE: "삭제",
  CLOSE: "폐업",
  REOPEN: "복원",
  ROLE_CHANGE: "권한 변경",
};
