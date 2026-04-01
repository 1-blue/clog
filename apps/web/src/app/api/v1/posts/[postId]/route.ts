import { prisma, type Role } from "@clog/db";
import { updatePostSchema } from "@clog/utils";

import {
  errorResponse,
  getAuthUserId,
  json,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";

/** 게시글 상세 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;

  try {
    const userId = await getAuthUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, nickname: true, profileImage: true } },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
        }),
      },
    });

    return json(post);
  } catch {
    return errorResponse("게시글을 찾을 수 없습니다.", 404);
  }
};

/** 게시글 수정 */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing) return errorResponse("게시글을 찾을 수 없습니다.", 404);
    if (existing.authorId !== userId)
      return errorResponse("권한이 없습니다.", 403);

    const body = await request.json();
    const data = updatePostSchema.parse(body);

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.category && { category: data.category }),
        ...(data.tags && { tags: data.tags }),
        ...(data.imageUrls && { imageUrls: data.imageUrls }),
      },
    });

    return jsonWithToast(post, "게시글이 수정되었습니다.");
  } catch {
    return errorResponse("게시글 수정에 실패했습니다.");
  }
};

/** 게시글 삭제 (작성자 또는 MANAGER 이상) */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing) return errorResponse("게시글을 찾을 수 없습니다.", 404);

    // MANAGER 이상이면 타인 게시글도 삭제 가능
    if (existing.authorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId! },
        select: { role: true },
      });
      const MANAGER_ROLES: Role[] = ["ADMIN", "MANAGER"];
      if (!user || !MANAGER_ROLES.includes(user.role)) {
        return errorResponse("권한이 없습니다.", 403);
      }
    }

    await prisma.post.delete({ where: { id: postId } });

    return jsonWithToast(null, "게시글이 삭제되었습니다.");
  } catch {
    return errorResponse("게시글 삭제에 실패했습니다.");
  }
};
