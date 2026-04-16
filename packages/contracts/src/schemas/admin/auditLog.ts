import { z } from "zod";

import { adminAuditActionEnum } from "../enums";
import { schemas } from "../shared";

export { adminAuditActionEnum };
export type { AdminAuditAction as TAdminAuditAction } from "../enums";

/** 어드민 감사 로그 쿼리 */
export const auditLogQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  actorId: z.string().uuid().optional(),
  action: adminAuditActionEnum.optional(),
  targetType: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type TAuditLogQuery = z.infer<typeof auditLogQuerySchema>;
