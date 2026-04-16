import {
  CreateSessionBody,
  PaginatedRecordListItem,
  RecordDetail,
  RecordListItem,
  UpdateSessionBody,
} from "../../../schemas/responses";
import { apiRegistry, z } from "../../registry";
import { paginatedResponse, singleResponse, toastResponse } from "../common";

const listQuery = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  userId: z.string().uuid().optional(),
  gymId: z.string().uuid().optional(),
  month: z.string().optional(),
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/records",
  operationId: "getRecords",
  summary: "기록 목록 (무한스크롤)",
  tags: ["Records"],
  request: { query: listQuery },
  responses: {
    200: {
      description: "목록",
      content: {
        "application/json": { schema: singleResponse(PaginatedRecordListItem) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/records",
  operationId: "createRecord",
  summary: "기록 생성",
  tags: ["Records"],
  request: {
    body: { content: { "application/json": { schema: CreateSessionBody } } },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: toastResponse(RecordDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/records/{recordId}",
  operationId: "getRecord",
  summary: "기록 상세",
  tags: ["Records"],
  request: { params: z.object({ recordId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(RecordDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/records/{recordId}",
  operationId: "updateRecord",
  summary: "기록 수정",
  tags: ["Records"],
  request: {
    params: z.object({ recordId: z.string().uuid() }),
    body: { content: { "application/json": { schema: UpdateSessionBody } } },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: toastResponse(RecordDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/records/{recordId}",
  operationId: "deleteRecord",
  summary: "기록 삭제",
  tags: ["Records"],
  request: { params: z.object({ recordId: z.string().uuid() }) },
  responses: { 200: { description: "삭제됨" } },
});
