import {
  adminGymQuerySchema,
  closeGymSchema,
  createGymSchema,
  updateGymSchema,
} from "../../../schemas/admin/gym";
import { adminRegistry, z } from "../../registry";

const GymListResponse = z.object({
  payload: z.object({
    items: z.array(z.any()),
    nextCursor: z.string().nullable(),
  }),
});

const GymResponse = z.object({ payload: z.any() });

adminRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/gyms",
  tags: ["Admin - Gyms"],
  summary: "암장 목록 (어드민)",
  request: { query: adminGymQuerySchema },
  responses: {
    200: {
      description: "목록",
      content: { "application/json": { schema: GymListResponse } },
    },
    403: { description: "관리자 권한 필요" },
  },
});

adminRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/gyms",
  tags: ["Admin - Gyms"],
  summary: "암장 생성",
  request: {
    body: {
      content: { "application/json": { schema: createGymSchema } },
    },
  },
  responses: {
    200: {
      description: "생성된 암장",
      content: { "application/json": { schema: GymResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "patch",
  path: "/api/v1/admin/gyms/{gymId}",
  tags: ["Admin - Gyms"],
  summary: "암장 수정",
  request: {
    params: z.object({ gymId: z.string().uuid() }),
    body: { content: { "application/json": { schema: updateGymSchema } } },
  },
  responses: {
    200: {
      description: "수정된 암장",
      content: { "application/json": { schema: GymResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/gyms/{gymId}/close",
  tags: ["Admin - Gyms"],
  summary: "암장 폐업 처리",
  request: {
    params: z.object({ gymId: z.string().uuid() }),
    body: { content: { "application/json": { schema: closeGymSchema } } },
  },
  responses: {
    200: {
      description: "폐업 처리됨",
      content: { "application/json": { schema: GymResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/gyms/{gymId}/reopen",
  tags: ["Admin - Gyms"],
  summary: "암장 폐업 해제",
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "재오픈",
      content: { "application/json": { schema: GymResponse } },
    },
  },
});
