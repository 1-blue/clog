import {
  Notification,
  PaginatedNotification,
} from "../../../schemas/responses";
import { apiRegistry, z } from "../../registry";
import { singleResponse } from "../common";

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/notifications",
  operationId: "getNotifications",
  summary: "알림 목록",
  tags: ["Notifications"],
  request: {
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(PaginatedNotification) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/notifications/{id}",
  operationId: "patchNotification",
  summary: "알림 읽음 처리",
  tags: ["Notifications"],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        "application/json": { schema: z.object({ isRead: z.boolean() }) },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(Notification) } },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/notifications/read",
  operationId: "readAllNotifications",
  summary: "알림 전체 읽음",
  tags: ["Notifications"],
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/notifications/{id}",
  operationId: "deleteNotification",
  summary: "알림 삭제",
  tags: ["Notifications"],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/notifications/unread-count",
  operationId: "getUnreadNotificationCount",
  summary: "안 읽은 알림 개수",
  tags: ["Notifications"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(z.object({ count: z.number().int() })),
        },
      },
    },
  },
});
