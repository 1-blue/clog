import { z } from "zod";

import { notificationTypeEnum } from "../enums";
import { schemas } from "../shared";

/** 알림 목록 조회 쿼리 */
export const notificationQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  type: notificationTypeEnum.optional(),
});

/** 단건 읽음 처리 */
export const patchNotificationSchema = z.object({
  isRead: z.literal(true),
});
