import type { ZodTypeAny } from "zod";

import { regionEnum } from "../../../schemas/enums";
import {
  CheckInResult,
  CheckOutResult,
  CreateReviewBody,
  GymDetail,
  GymListItem,
  GymMembershipPlan,
  PaginatedGymListItem,
  PaginatedReviewListItem,
  Review,
  UpdateReviewBody,
} from "../../../schemas/responses";
import { apiRegistry, z } from "../../registry";
import { paginatedResponse, singleResponse } from "../common";

// NOTE: gyms reviews 쪽은 기존 수동 yaml에서 `toast: string` 형태를 사용한다.
const toastStringResponse = <T extends ZodTypeAny>(payload: T) =>
  z.object({ toast: z.string(), payload });

const getGymsQuery = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  region: regionEnum.optional(),
  search: z.string().optional(),
  sort: z
    .enum([
      "name",
      "rating",
      "congestion",
      "reviewCount",
      "visitorCount",
      "monthlyCheckInCount",
    ])
    .optional()
    .default("name"),
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms",
  operationId: "getGyms",
  summary: "암장 목록 (무한스크롤)",
  tags: ["Gyms"],
  request: { query: getGymsQuery },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(PaginatedGymListItem),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms/{gymId}",
  operationId: "getGym",
  summary: "암장 상세",
  tags: ["Gyms"],
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(GymDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms/{gymId}/membership-plans",
  operationId: "getGymMembershipPlans",
  summary: "암장 회원권 요금표 (활성 행만)",
  tags: ["Gyms"],
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(z.array(GymMembershipPlan)),
        },
      },
    },
    404: { description: "Not Found" },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/gyms/{gymId}/check-in",
  operationId: "checkInGym",
  summary: "암장 체크인",
  tags: ["Gyms"],
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(CheckInResult) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/gyms/{gymId}/check-out",
  operationId: "checkOutGym",
  summary: "암장 체크아웃",
  tags: ["Gyms"],
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(CheckOutResult) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms/{gymId}/reviews",
  operationId: "getGymReviews",
  summary: "암장 리뷰 목록",
  tags: ["Gyms"],
  request: {
    params: z.object({ gymId: z.string().uuid() }),
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(PaginatedReviewListItem) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/gyms/{gymId}/reviews",
  operationId: "createGymReview",
  summary: "암장 리뷰 작성",
  tags: ["Gyms"],
  request: {
    params: z.object({ gymId: z.string().uuid() }),
    body: { content: { "application/json": { schema: CreateReviewBody } } },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: toastStringResponse(Review) } },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms/{gymId}/reviews/me",
  operationId: "getMyGymReview",
  summary: "내 암장 리뷰 조회",
  tags: ["Gyms"],
  request: { params: z.object({ gymId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(Review.nullable()) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/gyms/{gymId}/reviews/{reviewId}",
  operationId: "updateGymReview",
  summary: "암장 리뷰 수정",
  tags: ["Gyms"],
  request: {
    params: z.object({ gymId: z.string().uuid(), reviewId: z.string().uuid() }),
    body: { content: { "application/json": { schema: UpdateReviewBody } } },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: toastStringResponse(Review) } },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/gyms/{gymId}/reviews/{reviewId}",
  operationId: "getGymReview",
  summary: "암장 리뷰 상세",
  tags: ["Gyms"],
  request: {
    params: z.object({ gymId: z.string().uuid(), reviewId: z.string().uuid() }),
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(Review) } },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/gyms/{gymId}/reviews/{reviewId}",
  operationId: "deleteGymReview",
  summary: "암장 리뷰 삭제",
  tags: ["Gyms"],
  request: {
    params: z.object({ gymId: z.string().uuid(), reviewId: z.string().uuid() }),
  },
  responses: { 200: { description: "삭제됨" } },
});
