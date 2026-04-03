import { prisma } from "@clog/db";
import { updateSessionSchema } from "@clog/utils";

import { errorResponse, json, jsonWithToast, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  adjustMembershipOnSessionPatch,
  assertMembershipDateValidForSession,
  refundMembershipOnSessionDelete,
  sessionDateForValidation,
} from "#web/libs/membership/sessionMembership";
import { resolveSessionImageUrlsForDb } from "#web/libs/record/resolveSessionImageUrls";
import { recomputeUserMaxDifficulty } from "#web/libs/user/updateUserMaxDifficulty";

const membershipErrorMessage = (e: unknown): string | null => {
  if (!(e instanceof Error)) return null;
  switch (e.message) {
    case "MEMBERSHIP_NOT_FOUND":
      return "선택한 회원권을 찾을 수 없습니다.";
    case "MEMBERSHIP_DATE_INVALID":
      return "방문일이 회원권 유효 기간 안이 아니에요.";
    case "MEMBERSHIP_USES_EXHAUSTED":
      return "회원권 잔여 횟수가 없어요.";
    default:
      return null;
  }
};

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
        userMembership: {
          select: {
            id: true,
            gym: { select: { id: true, name: true } },
            plan: { select: { code: true } },
          },
        },
      },
    });

    if (!session) return errorResponse("기록을 찾을 수 없습니다.", 404);
    if (!session.isPublic && session.userId !== userId) {
      return errorResponse("비공개 기록입니다.", 403);
    }

    const isOwner = session.userId === userId;
    return json({
      ...session,
      userMembership: isOwner ? session.userMembership : null,
    });
  } catch (error) {
    return catchApiError(_request, error, "기록을 불러올 수 없습니다.", {
      userId: userId!,
    });
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

    const session = await prisma.$transaction(async (tx) => {
      const existing = await tx.climbingSession.findUnique({
        where: { id: recordId },
      });
      if (!existing) {
        throw new Error("NOT_FOUND");
      }
      if (existing.userId !== userId) {
        throw new Error("FORBIDDEN");
      }

      const nextDate = data.date ?? existing.date;
      const sessionDate = sessionDateForValidation(nextDate);

      try {
        if (data.userMembershipId !== undefined) {
          const prev = existing.userMembershipId;
          const next = data.userMembershipId;
          if (prev !== next) {
            await adjustMembershipOnSessionPatch(tx, {
              userId: userId!,
              gymId: existing.gymId,
              sessionDate,
              previousMembershipId: prev,
              nextMembershipId: next,
            });
          } else if (prev && data.date) {
            await assertMembershipDateValidForSession(tx, {
              userId: userId!,
              gymId: existing.gymId,
              sessionDate,
              userMembershipId: prev,
            });
          }
        } else if (data.date && existing.userMembershipId) {
          await assertMembershipDateValidForSession(tx, {
            userId: userId!,
            gymId: existing.gymId,
            sessionDate,
            userMembershipId: existing.userMembershipId,
          });
        }
      } catch (me) {
        const msg = membershipErrorMessage(me);
        if (msg) throw new Error(msg);
        throw me;
      }

      if (data.routes) {
        await tx.climbingRoute.deleteMany({ where: { sessionId: recordId } });
      }

      const nextImageUrls =
        data.imageUrls !== undefined
          ? await resolveSessionImageUrlsForDb(tx, existing.gymId, data.imageUrls)
          : undefined;

      return tx.climbingSession.update({
        where: { id: recordId },
        data: {
          ...(data.date && { date: data.date }),
          ...(data.startTime && { startTime: data.startTime }),
          ...(data.endTime && { endTime: data.endTime }),
          ...(data.memo !== undefined && { memo: data.memo }),
          ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
          ...(data.userMembershipId !== undefined && {
            userMembershipId: data.userMembershipId,
          }),
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
          ...(nextImageUrls !== undefined && { imageUrls: nextImageUrls }),
        },
        include: { routes: true },
      });
    });

    if (data.routes !== undefined) {
      await recomputeUserMaxDifficulty(userId!);
    }

    return jsonWithToast(session, "기록이 수정되었습니다.");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return errorResponse("기록을 찾을 수 없습니다.", 404);
      }
      if (error.message === "FORBIDDEN") {
        return errorResponse("권한이 없습니다.", 403);
      }
      if (error.message.includes("회원권")) {
        return errorResponse(error.message, 400);
      }
    }
    return catchApiError(request, error, "기록 수정에 실패했습니다.", {
      userId: userId!,
    });
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

    await prisma.$transaction(async (tx) => {
      await refundMembershipOnSessionDelete(tx, {
        userMembershipId: existing.userMembershipId,
      });
      await tx.climbingSession.delete({ where: { id: recordId } });
    });

    await recomputeUserMaxDifficulty(userId!);

    return jsonWithToast(null, "기록이 삭제되었습니다.");
  } catch (error) {
    return catchApiError(_request, error, "기록 삭제에 실패했습니다.", {
      userId: userId!,
    });
  }
};
