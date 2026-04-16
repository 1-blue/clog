import { prisma } from "@clog/db/prisma";

import { json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 조회수 1회 증가 (로그인 사용자만, 클라이언트에서 세션당 1회 호출) */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    return json({ viewCount: post.viewCount });
  } catch (error) {
    return catchApiError(request, error, "게시글을 찾을 수 없습니다.", {
      status: 404,
    });
  }
};
