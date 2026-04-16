import { z } from "../../openapi/registry";
import { communityCategoryEnum } from "../enums";
import { AuthorSummary } from "./users.shared";

export const Post = z
  .object({
    id: z.string().uuid(),
    authorId: z.string().uuid(),
    category: communityCategoryEnum,
    title: z.string(),
    content: z.string(),
    viewCount: z.number().int(),
    likeCount: z.number().int(),
    commentCount: z.number().int(),
    tags: z.array(z.string()),
    imageUrls: z.array(z.string().url()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("Post");

const IdOnly = z.object({ id: z.string().uuid() });

export const PostListItem = Post.extend({
  author: AuthorSummary,
  likes: z.array(IdOnly).optional(),
  bookmarks: z.array(IdOnly).optional(),
}).openapi("PostListItem");

export const PostDetail = PostListItem.openapi("PostDetail");

export const PaginatedPostListItem = z
  .object({
    items: z.array(PostListItem),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedPostListItem");

export const CreatePostBody = z
  .object({
    category: communityCategoryEnum,
    title: z.string().min(2).max(100),
    content: z.string().min(10).max(5000),
    tags: z.array(z.string().max(20)).max(10).optional(),
    imageUrls: z.array(z.string().url()).max(10).optional(),
  })
  .openapi("CreatePostBody");

export const UpdatePostBody = z
  .object({
    title: z.string().min(2).max(100).optional(),
    content: z.string().min(10).max(5000).optional(),
    category: communityCategoryEnum.optional(),
    tags: z.array(z.string().max(20)).max(10).optional(),
    imageUrls: z.array(z.string().url()).max(10).optional(),
  })
  .openapi("UpdatePostBody");
