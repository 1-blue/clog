import { z } from "../../openapi/registry";
import { notificationTypeEnum } from "../enums";

export const Notification = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: notificationTypeEnum,
    title: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    link: z.string().nullable().optional(),
    commentId: z.string().uuid().nullable().optional(),
    createdAt: z.string().datetime(),
  })
  .openapi("Notification");

export const PaginatedNotification = z
  .object({
    items: z.array(Notification),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedNotification");
