import {
  adminUpdateUserSchema,
  adminUserQuerySchema,
} from "../../../schemas/admin/user";
import { adminRegistry, z } from "../../registry";

const UserListResponse = z.object({
  payload: z.object({
    items: z.array(z.any()),
    nextCursor: z.string().nullable(),
  }),
});
const UserResponse = z.object({ payload: z.any() });

adminRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/users",
  tags: ["Admin - Users"],
  summary: "유저 목록",
  request: { query: adminUserQuerySchema },
  responses: {
    200: {
      description: "유저 목록",
      content: { "application/json": { schema: UserListResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "patch",
  path: "/api/v1/admin/users/{userId}",
  tags: ["Admin - Users"],
  summary: "유저 수정",
  request: {
    params: z.object({ userId: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: adminUpdateUserSchema } },
    },
  },
  responses: {
    200: {
      description: "수정된 유저",
      content: { "application/json": { schema: UserResponse } },
    },
  },
});

adminRegistry.registerPath({
  method: "delete",
  path: "/api/v1/admin/users/{userId}",
  tags: ["Admin - Users"],
  summary: "유저 삭제",
  request: { params: z.object({ userId: z.string().uuid() }) },
  responses: { 200: { description: "삭제됨" } },
});
