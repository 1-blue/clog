import { z } from "../../openapi/registry";
import { AuthorSummary } from "./users.shared";

export const CommentWithAuthor = z
  .object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    authorId: z.string().uuid(),
    parentId: z.string().uuid().nullable(),
    content: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    author: AuthorSummary,
  })
  .openapi("CommentWithAuthor");

export const CommentListItem = CommentWithAuthor.extend({
  replies: z.array(CommentWithAuthor),
}).openapi("CommentListItem");

export const PaginatedCommentListItem = z
  .object({
    items: z.array(CommentListItem),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedCommentListItem");

export const CreateCommentBody = z
  .object({
    content: z.string().min(1).max(1000),
    parentId: z.string().uuid().optional(),
  })
  .openapi("CreateCommentBody");

export const UpdateCommentBody = z
  .object({
    content: z.string().min(1).max(1000),
  })
  .openapi("UpdateCommentBody");
