import { auditLogQuerySchema } from "../../../schemas/admin/auditLog";
import { adminRegistry, z } from "../../registry";

const ListResponse = z.object({
  payload: z.object({
    items: z.array(z.any()),
    nextCursor: z.string().nullable(),
  }),
});
const ItemResponse = z.object({ payload: z.any() });

adminRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/audit-logs",
  tags: ["Admin - AuditLogs"],
  summary: "감사 로그 목록",
  request: { query: auditLogQuerySchema },
  responses: {
    200: {
      description: "목록",
      content: { "application/json": { schema: ListResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/audit-logs/{logId}",
  tags: ["Admin - AuditLogs"],
  summary: "감사 로그 상세",
  request: { params: z.object({ logId: z.string().uuid() }) },
  responses: {
    200: {
      description: "상세",
      content: { "application/json": { schema: ItemResponse } },
    },
  },
});
