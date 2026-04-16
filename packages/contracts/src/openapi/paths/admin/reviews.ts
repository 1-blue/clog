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
  path: "/api/v1/admin/reviews",
  tags: ["Admin - Reviews"],
  summary: "리뷰 목록",
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

adminRegistry.registerPath({
  method: "delete",
  path: "/api/v1/admin/reviews/{reviewId}",
  tags: ["Admin - Reviews"],
  summary: "리뷰 삭제",
  request: { params: z.object({ reviewId: z.string().uuid() }) },
  responses: { 200: { description: "삭제됨" } },
});
