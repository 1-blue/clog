import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import { errorResponse, jsonWithToast, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  const { postId } = await params;
  try {
    const before = await prisma.post.findUnique({ where: { id: postId } });
    if (!before) return errorResponse("게시글을 찾을 수 없습니다.", 404);

    await prisma.$transaction(async (tx) => {
      await tx.post.delete({ where: { id: postId } });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "DELETE",
          targetType: "Post",
          targetId: postId,
          targetLabel: before.title,
          before,
          request,
        },
        tx,
      );
    });

    return jsonWithToast(null, "게시글이 삭제되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "게시글 삭제에 실패했습니다.");
  }
};
