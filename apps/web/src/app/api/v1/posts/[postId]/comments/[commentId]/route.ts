import { prisma } from "@clog/db";
import { updateCommentSchema } from "@clog/utils";

import {
  errorResponse,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";

const authorInclude = {
  author: { select: { id: true, nickname: true, profileImage: true } },
} as const;

/** 댓글 수정 */
export const PATCH = async (
  request: Request,
  {
    params,
  }: { params: Promise<{ postId: string; commentId: string }> },
) => {
  const { postId, commentId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.postComment.findFirst({
      where: { id: commentId, postId },
    });
    if (!existing) return errorResponse("댓글을 찾을 수 없습니다.", 404);
    if (existing.authorId !== userId) {
      return errorResponse("권한이 없습니다.", 403);
    }

    const body = await request.json();
    const data = updateCommentSchema.parse(body);

    const comment = await prisma.postComment.update({
      where: { id: commentId },
      data: { content: data.content },
      include: authorInclude,
    });

    return jsonWithToast(comment, "댓글이 수정되었습니다.");
  } catch {
    return errorResponse("댓글 수정에 실패했습니다.");
  }
};

/** 댓글 삭제 (대댓글은 DB Cascade) */
export const DELETE = async (
  _request: Request,
  {
    params,
  }: { params: Promise<{ postId: string; commentId: string }> },
) => {
  const { postId, commentId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.postComment.findFirst({
      where: { id: commentId, postId },
    });
    if (!existing) return errorResponse("댓글을 찾을 수 없습니다.", 404);
    if (existing.authorId !== userId) {
      return errorResponse("권한이 없습니다.", 403);
    }

    await prisma.$transaction(async (tx) => {
      await tx.postComment.delete({ where: { id: commentId } });
      const count = await tx.postComment.count({ where: { postId } });
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: count },
      });
    });

    return jsonWithToast(null, "댓글이 삭제되었습니다.");
  } catch {
    return errorResponse("댓글 삭제에 실패했습니다.");
  }
};
