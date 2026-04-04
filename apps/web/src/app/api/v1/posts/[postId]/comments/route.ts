import { prisma } from "@clog/db";
import { NotificationType } from "@prisma/client";
import { commentQuerySchema, createCommentSchema } from "@clog/utils";

import { ROUTES } from "#web/constants";
import { sendExpoPush } from "#web/libs/expo/sendExpoPush";
import {
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 댓글 목록 (무한스크롤) */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;

  try {
    const searchParams = getSearchParams(request);
    const query = commentQuerySchema.parse(searchParams);

    const comments = await prisma.postComment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "asc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        author: { select: { id: true, nickname: true, profileImage: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, nickname: true, profileImage: true },
            },
          },
        },
      },
    });

    const hasMore = comments.length > query.limit;
    const items = hasMore ? comments.slice(0, query.limit) : comments;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "댓글을 불러올 수 없습니다.");
  }
};

/** 댓글 작성 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    const comment = await prisma.$transaction(async (tx) => {
      const created = await tx.postComment.create({
        data: {
          postId,
          authorId: userId!,
          content: data.content,
          parentId: data.parentId,
        },
        include: {
          author: { select: { id: true, nickname: true, profileImage: true } },
        },
      });

      const count = await tx.postComment.count({ where: { postId } });
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: count },
      });

      return created;
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post) {
      const link = ROUTES.COMMUNITY.DETAIL.path(postId);
      const nickname = comment.author.nickname;

      if (data.parentId) {
        const parent = await prisma.postComment.findFirst({
          where: { id: data.parentId, postId },
          select: { authorId: true },
        });
        if (parent && parent.authorId !== userId) {
          const notif = await prisma.notification.create({
            data: {
              userId: parent.authorId,
              type: NotificationType.COMMENT_REPLY,
              title: "내 댓글에 답글",
              message: `${nickname}님이 답글을 남겼습니다.`,
              link,
              commentId: comment.id,
            },
          });
          await sendExpoPush({
            recipientUserId: parent.authorId,
            title: notif.title,
            body: notif.message,
            data: {
              type: notif.type,
              link: notif.link ?? undefined,
              notificationId: notif.id,
              postId,
            },
          });
        }
      } else if (post.authorId !== userId) {
        const notif = await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: NotificationType.POST_COMMENT,
            title: "게시글에 댓글",
            message: `${nickname}님이 댓글을 남겼습니다.`,
            link,
            commentId: comment.id,
          },
        });
        await sendExpoPush({
          recipientUserId: post.authorId,
          title: notif.title,
          body: notif.message,
          data: {
            type: notif.type,
            link: notif.link ?? undefined,
            notificationId: notif.id,
            postId,
          },
        });
      }
    }

    return jsonWithToast(comment, "댓글이 등록되었습니다.", 201);
  } catch (error) {
    return catchApiError(request, error, "댓글 작성에 실패했습니다.", {
      userId: userId!,
    });
  }
};
