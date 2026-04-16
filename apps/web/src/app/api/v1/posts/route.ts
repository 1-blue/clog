import { createPostSchema, postQuerySchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import {
  getAuthUserId,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { notifySlackPostCreated } from "#web/libs/slack/notifications";

/** 게시글 목록 (무한스크롤) */
export const GET = async (request: Request) => {
  try {
    const userId = await getAuthUserId();
    const params = getSearchParams(request);
    const query = postQuerySchema.parse(params);

    const where = {
      ...(query.category && { category: query.category }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { content: { contains: query.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        author: { select: { id: true, nickname: true, profileImage: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
        }),
      },
    });

    const hasMore = posts.length > query.limit;
    const items = hasMore ? posts.slice(0, query.limit) : posts;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "게시글을 불러올 수 없습니다.");
  }
};

/** 게시글 작성 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        authorId: userId!,
        category: data.category,
        title: data.title,
        content: data.content,
        tags: data.tags ?? [],
        imageUrls: data.imageUrls ?? [],
      },
    });

    const author = await prisma.user.findUnique({
      where: { id: userId! },
      select: { nickname: true },
    });
    notifySlackPostCreated({
      nickname: author?.nickname ?? "(닉네임 없음)",
      userId: userId!,
      postId: post.id,
      category: post.category,
      title: post.title,
      content: post.content,
      tags: post.tags,
    });

    return jsonWithToast(post, "게시글이 등록되었습니다.", 201);
  } catch (error) {
    return catchApiError(request, error, "게시글 작성에 실패했습니다.", {
      userId: userId!,
    });
  }
};
