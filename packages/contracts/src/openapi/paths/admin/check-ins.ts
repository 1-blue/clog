import { schemas } from "../../../schemas/shared";
import { adminRegistry, z } from "../../registry";

const ListResponse = z.object({
  payload: z.object({
    items: z.array(z.any()),
    nextCursor: z.string().nullable(),
  }),
});

adminRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/check-ins",
  tags: ["Admin - CheckIns"],
  summary: "활성 체크인 목록",
  request: {
    query: z.object({ cursor: schemas.cursor, limit: schemas.limit }),
  },
  responses: {
    200: {
      description: "목록",
      content: { "application/json": { schema: ListResponse } },
    },
  },
});
