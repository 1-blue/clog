import { apiRegistry, z } from "../../registry";
import { singleResponse } from "../common";

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/stats/completion-week",
  operationId: "getCompletionWeekStats",
  summary: "완등 주간 통계",
  tags: ["Stats"],
  request: {
    query: z.object({
      anchor: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(
            z.object({
              points: z.array(
                z.object({
                  date: z.string(),
                  count: z.number().int(),
                }),
              ),
            }),
          ),
        },
      },
    },
  },
});
