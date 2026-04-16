import type { ZodTypeAny } from "zod";

import {
  CreateMembershipPauseBody,
  CreateUserMembershipBody,
  MembershipPauseItem,
  MeStatisticsPayload,
  MyCheckInItem,
  PaginatedFollowUser,
  PaginatedPostListItem,
  PaginatedRecordListItem,
  PatchMembershipPauseBody,
  PatchUserMembershipBody,
  RegisterPushDeviceBody,
  UpdateUserBody,
  User,
  UserMe,
  UserMembership,
  UserMembershipUsagePayload,
  UserProfile,
  UserPushDevice,
} from "../../../schemas/responses";
import { apiRegistry, z } from "../../registry";
import { singleResponse } from "../common";

// NOTE: users 쪽은 기존 수동 yaml에서 `toast: string` 형태를 사용한다.
const toastStringResponse = <T extends ZodTypeAny>(payload: T) =>
  z.object({ toast: z.string(), payload });

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me",
  operationId: "getMe",
  summary: "내 정보 (비로그인 시에도 200, payload null)",
  tags: ["Users"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(UserMe),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/users/me",
  operationId: "updateMe",
  summary: "내 정보 수정",
  tags: ["Users"],
  request: {
    body: { content: { "application/json": { schema: UpdateUserBody } } },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: toastStringResponse(User) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/users/me",
  operationId: "deleteMe",
  summary: "회원 탈퇴",
  tags: ["Users"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: toastStringResponse(z.any().nullable()) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/check-ins",
  operationId: "getMyCheckIns",
  summary:
    "내 체크인 목록 (linkableOnly=true면 30분 이상·미연결·종료된 체크인만)",
  tags: ["Users"],
  request: {
    query: z.object({
      linkableOnly: z.coerce.boolean().optional().default(false),
      forSessionId: z.string().uuid().optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            payload: z.object({ items: z.array(MyCheckInItem) }),
          }),
        },
      },
    },
    401: { description: "Unauthorized" },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/me/push-device",
  operationId: "registerPushDevice",
  summary: "Expo 푸시 토큰 등록·갱신",
  tags: ["Users"],
  request: {
    body: {
      content: { "application/json": { schema: RegisterPushDeviceBody } },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(UserPushDevice) },
      },
    },
    401: { description: "Unauthorized" },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/users/me/push-device",
  operationId: "deletePushDevice",
  summary: "Expo 푸시 토큰 삭제",
  tags: ["Users"],
  request: { query: z.object({ token: z.string().min(1) }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(z.any().nullable()) },
      },
    },
    401: { description: "Unauthorized" },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/memberships",
  operationId: "getMyMemberships",
  summary: "내 회원권 목록",
  tags: ["Users"],
  request: {
    query: z.object({
      gymId: z.string().uuid().optional(),
      activeOnly: z.enum(["true", "false"]).optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(z.array(UserMembership)) },
      },
    },
    401: { description: "Unauthorized" },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/me/memberships",
  operationId: "createMyMembership",
  summary: "내 회원권 등록",
  tags: ["Users"],
  request: {
    body: {
      content: { "application/json": { schema: CreateUserMembershipBody } },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: toastStringResponse(UserMembership) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/memberships/{userMembershipId}",
  operationId: "getMyMembershipById",
  summary: "내 회원권 상세",
  tags: ["Users"],
  request: { params: z.object({ userMembershipId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(UserMembership) },
      },
    },
    401: { description: "Unauthorized" },
    404: { description: "Not Found" },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/users/me/memberships/{userMembershipId}",
  operationId: "patchMyMembership",
  summary: "내 회원권 수정",
  tags: ["Users"],
  request: {
    params: z.object({ userMembershipId: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: PatchUserMembershipBody } },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: toastStringResponse(UserMembership) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/users/me/memberships/{userMembershipId}",
  operationId: "deleteMyMembership",
  summary: "내 회원권 삭제",
  tags: ["Users"],
  request: { params: z.object({ userMembershipId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: toastStringResponse(z.any().nullable()) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/memberships/{userMembershipId}/usage",
  operationId: "getMyMembershipUsage",
  summary: "내 회원권 사용 내역",
  tags: ["Users"],
  request: { params: z.object({ userMembershipId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(UserMembershipUsagePayload),
        },
      },
    },
    401: { description: "Unauthorized" },
    404: { description: "Not Found" },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/memberships/{userMembershipId}/pauses",
  operationId: "getMyMembershipPauses",
  summary: "내 회원권 일시정지 목록",
  tags: ["Users"],
  request: { params: z.object({ userMembershipId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(z.array(MembershipPauseItem)),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/me/memberships/{userMembershipId}/pauses",
  operationId: "createMyMembershipPause",
  summary: "내 회원권 일시정지 생성",
  tags: ["Users"],
  request: {
    params: z.object({ userMembershipId: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: CreateMembershipPauseBody } },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: toastStringResponse(MembershipPauseItem),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/users/me/memberships/{userMembershipId}/pauses/{pauseId}",
  operationId: "patchMyMembershipPause",
  summary: "내 회원권 일시정지 수정",
  tags: ["Users"],
  request: {
    params: z.object({
      userMembershipId: z.string().uuid(),
      pauseId: z.string().uuid(),
    }),
    body: {
      content: { "application/json": { schema: PatchMembershipPauseBody } },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: toastStringResponse(MembershipPauseItem),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/users/me/memberships/{userMembershipId}/pauses/{pauseId}",
  operationId: "deleteMyMembershipPause",
  summary: "내 회원권 일시정지 삭제",
  tags: ["Users"],
  request: {
    params: z.object({
      userMembershipId: z.string().uuid(),
      pauseId: z.string().uuid(),
    }),
  },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/nickname-availability",
  operationId: "checkNicknameAvailability",
  summary: "닉네임 사용 가능 여부",
  tags: ["Users"],
  request: { query: z.object({ nickname: z.string().min(1) }) },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(z.object({ available: z.boolean() })),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/followers",
  operationId: "getMyFollowers",
  summary: "내 팔로워 목록",
  tags: ["Users"],
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
        "application/json": { schema: singleResponse(PaginatedFollowUser) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/following",
  operationId: "getMyFollowing",
  summary: "내 팔로잉 목록",
  tags: ["Users"],
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
        "application/json": { schema: singleResponse(PaginatedFollowUser) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/bookmarked-posts",
  operationId: "getMyBookmarkedPosts",
  summary: "내 북마크 게시글",
  tags: ["Users"],
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
        "application/json": { schema: singleResponse(PaginatedPostListItem) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/liked-posts",
  operationId: "getMyLikedPosts",
  summary: "내 좋아요 게시글",
  tags: ["Users"],
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
        "application/json": { schema: singleResponse(PaginatedPostListItem) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me/statistics",
  operationId: "getMeStatistics",
  summary: "내 통계",
  tags: ["Users"],
  request: {
    query: z.object({
      period: z.enum(["week", "month", "year", "all"]).optional(),
      anchor: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(MeStatisticsPayload) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/{userId}",
  operationId: "getUserProfile",
  summary: "유저 프로필",
  tags: ["Users"],
  request: { params: z.object({ userId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(UserProfile) } },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/{userId}/follow",
  operationId: "followUser",
  summary: "팔로우",
  tags: ["Users"],
  request: { params: z.object({ userId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/users/{userId}/follow",
  operationId: "unfollowUser",
  summary: "언팔로우",
  tags: ["Users"],
  request: { params: z.object({ userId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/{userId}/followers",
  operationId: "getUserFollowers",
  summary: "유저 팔로워 목록",
  tags: ["Users"],
  request: {
    params: z.object({ userId: z.string().uuid() }),
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(PaginatedFollowUser) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/{userId}/following",
  operationId: "getUserFollowing",
  summary: "유저 팔로잉 목록",
  tags: ["Users"],
  request: {
    params: z.object({ userId: z.string().uuid() }),
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(PaginatedFollowUser) },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/{userId}/public-records",
  operationId: "getUserPublicRecords",
  summary: "유저 공개 기록 목록",
  tags: ["Users"],
  request: {
    params: z.object({ userId: z.string().uuid() }),
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": { schema: singleResponse(PaginatedRecordListItem) },
      },
    },
  },
});
