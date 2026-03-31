import { prisma } from "@clog/db";
import { updateSessionSchema } from "@clog/utils";

import { errorResponse, json, jsonWithToast, requireAuth } from "#web/libs/api";

/** 기록 상세 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ recordId: string }> },
) => {
  const { recordId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const session = await prisma.climbingSession.findUnique({
      where: { id: recordId },
      include: {
        gym: { select: { id: true, name: true, address: true } },
        routes: { orderBy: { order: "asc" } },
        user: { select: { id: true, nickname: true, profileImage: true } },
      },
    });

    if (!session) return errorResponse("기록을 찾을 수 없습니다.", 404);
    if (!session.isPublic && session.userId !== userId) {
      return errorResponse("비공개 기록입니다.", 403);
    }

    return json(session);
  } catch {
    return errorResponse("기록을 불러올 수 없습니다.");
  }
};

/** 기록 수정 */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ recordId: string }> },
) => {
  const { recordId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.climbingSession.findUnique({
      where: { id: recordId },
    });
    if (!existing) return errorResponse("기록을 찾을 수 없습니다.", 404);
    if (existing.userId !== userId)
      return errorResponse("권한이 없습니다.", 403);

    const body = await request.json();
    const data = updateSessionSchema.parse(body);

    // 루트 교체 시 기존 삭제 후 재생성
    if (data.routes) {
      await prisma.climbingRoute.deleteMany({ where: { sessionId: recordId } });
    }

    const session = await prisma.climbingSession.update({
      where: { id: recordId },
      data: {
        ...(data.date && { date: data.date }),
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.endTime && { endTime: data.endTime }),
        ...(data.memo !== undefined && { memo: data.memo }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        ...(data.routes && {
          routes: {
            create: data.routes.map((r, i) => ({
              difficulty: r.difficulty,
              result: r.result,
              attempts: r.attempts,
              memo: r.memo,
              order: i,
            })),
          },
        }),
        ...(data.imageUrls && { imageUrls: data.imageUrls }),
      },
      include: { routes: true },
    });

    return jsonWithToast(session, "기록이 수정되었습니다.");
  } catch {
    return errorResponse("기록 수정에 실패했습니다.");
  }
};

/** 기록 삭제 */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ recordId: string }> },
) => {
  const { recordId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.climbingSession.findUnique({
      where: { id: recordId },
    });
    if (!existing) return errorResponse("기록을 찾을 수 없습니다.", 404);
    if (existing.userId !== userId)
      return errorResponse("권한이 없습니다.", 403);

    await prisma.climbingSession.delete({ where: { id: recordId } });

    return jsonWithToast(null, "기록이 삭제되었습니다.");
  } catch {
    return errorResponse("기록 삭제에 실패했습니다.");
  }
};
