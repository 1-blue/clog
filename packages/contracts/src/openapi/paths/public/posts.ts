import {
  CreateCommentBody,
  CreatePostBody,
  PaginatedCommentListItem,
  PaginatedPostListItem,
  PostDetail,
  PostListItem,
  UpdateCommentBody,
  UpdatePostBody,
} from "../../../schemas/responses";
import { apiRegistry, z } from "../../registry";
import { paginatedResponse, singleResponse, toastResponse } from "../common";

const listQuery = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  category: z.string().optional(),
  search: z.string().optional(),
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/posts",
  operationId: "getPosts",
  summary: "게시글 목록",
  tags: ["Posts"],
  request: { query: listQuery },
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
  method: "post",
  path: "/api/v1/posts",
  operationId: "createPost",
  summary: "게시글 작성",
  tags: ["Posts"],
  request: {
    body: { content: { "application/json": { schema: CreatePostBody } } },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: toastResponse(PostDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/posts/{postId}",
  operationId: "getPost",
  summary: "게시글 상세",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: singleResponse(PostDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/posts/{postId}",
  operationId: "updatePost",
  summary: "게시글 수정",
  tags: ["Posts"],
  request: {
    params: z.object({ postId: z.string().uuid() }),
    body: { content: { "application/json": { schema: UpdatePostBody } } },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: toastResponse(PostDetail) } },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/posts/{postId}",
  operationId: "deletePost",
  summary: "게시글 삭제",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "삭제됨" } },
});

apiRegistry.registerPath({
  method: "get",
  path: "/api/v1/posts/{postId}/comments",
  operationId: "getComments",
  summary: "댓글 목록",
  tags: ["Comments"],
  request: {
    params: z.object({ postId: z.string().uuid() }),
    query: z.object({
      cursor: z.string().uuid().optional(),
      limit: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(PaginatedCommentListItem),
        },
      },
    },
  },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/posts/{postId}/comments",
  operationId: "createComment",
  summary: "댓글 작성",
  tags: ["Comments"],
  request: {
    params: z.object({ postId: z.string().uuid() }),
    body: { content: { "application/json": { schema: CreateCommentBody } } },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: toastResponse(z.any()) } },
    },
  },
});

apiRegistry.registerPath({
  method: "patch",
  path: "/api/v1/posts/{postId}/comments/{commentId}",
  operationId: "updateComment",
  summary: "댓글 수정",
  tags: ["Comments"],
  request: {
    params: z.object({
      postId: z.string().uuid(),
      commentId: z.string().uuid(),
    }),
    body: { content: { "application/json": { schema: UpdateCommentBody } } },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: toastResponse(z.any()) } },
    },
  },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/posts/{postId}/comments/{commentId}",
  operationId: "deleteComment",
  summary: "댓글 삭제",
  tags: ["Comments"],
  request: {
    params: z.object({
      postId: z.string().uuid(),
      commentId: z.string().uuid(),
    }),
  },
  responses: { 200: { description: "삭제됨" } },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/posts/{postId}/like",
  operationId: "likePost",
  summary: "게시글 좋아요",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/posts/{postId}/like",
  operationId: "unlikePost",
  summary: "게시글 좋아요 취소",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/posts/{postId}/bookmark",
  operationId: "bookmarkPost",
  summary: "게시글 북마크",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "delete",
  path: "/api/v1/posts/{postId}/bookmark",
  operationId: "unbookmarkPost",
  summary: "게시글 북마크 취소",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/posts/{postId}/view",
  operationId: "viewPost",
  summary: "게시글 조회수 증가",
  tags: ["Posts"],
  request: { params: z.object({ postId: z.string().uuid() }) },
  responses: { 200: { description: "OK" } },
});
