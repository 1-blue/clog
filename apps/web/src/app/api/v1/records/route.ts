import { prisma } from "@clog/db";
import { createSessionSchema, recordQuerySchema } from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  applyMembershipOnSessionCreate,
  sessionDateForValidation,
} from "#web/libs/membership/sessionMembership";
import { resolveSessionImageUrlsForDb } from "#web/libs/record/resolveSessionImageUrls";
import { bumpUserMaxDifficultyFromRoutes } from "#web/libs/user/updateUserMaxDifficulty";

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

/** 기록 목록 (무한스크롤) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = recordQuerySchema.parse(params);

    let dateFilter: { gte: Date; lt: Date } | undefined;
    if (query.month) {
      const [year, mon] = query.month.split("-").map(Number);
      dateFilter = {
        gte: new Date(year!, mon! - 1, 1),
        lt: new Date(year!, mon!, 1),
      };
    }

    const MONTH_LIMIT = 200;

    const sessions = await prisma.climbingSession.findMany({
      where: {
        userId: userId!,
        ...(dateFilter && { date: dateFilter }),
      },
      orderBy: { date: "desc" },
      take: dateFilter ? MONTH_LIMIT : query.limit + 1,
      ...(query.cursor &&
        !dateFilter && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        gym: {
          select: {
            id: true,
            name: true,
            logoImageUrl: true,
            difficultyColors: { orderBy: { order: "asc" } },
          },
        },
        routes: { orderBy: { order: "asc" } },
      },
    });

    const hasMore = dateFilter ? false : sessions.length > query.limit;
    const items = hasMore ? sessions.slice(0, query.limit) : sessions;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "기록을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};

/** 기록 생성 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createSessionSchema.parse(body);

    const session = await prisma.$transaction(async (tx) => {
      let linkedId: string | null = null;
      try {
        linkedId = await applyMembershipOnSessionCreate(tx, {
          userId: userId!,
          gymId: data.gymId,
          sessionDate: sessionDateForValidation(data.date),
          userMembershipId: data.userMembershipId ?? null,
        });
      } catch (me) {
        const msg = membershipErrorMessage(me);
        if (msg) throw new Error(msg);
        throw me;
      }

      const imageUrls = await resolveSessionImageUrlsForDb(
        tx,
        data.gymId,
        data.imageUrls ?? [],
      );

      return tx.climbingSession.create({
        data: {
          userId: userId!,
          gymId: data.gymId,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          memo: data.memo,
          isPublic: data.isPublic,
          userMembershipId: linkedId,
          routes: {
            create: data.routes.map((r, i) => ({
              difficulty: r.difficulty,
              result: r.result,
              attempts: r.attempts,
              memo: r.memo,
              order: i,
            })),
          },
          imageUrls,
        },
        include: {
          routes: true,
        },
      });
    });

    await bumpUserMaxDifficultyFromRoutes(userId!, session.routes);

    return jsonWithToast(session, "기록이 저장되었습니다.", 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("회원권")) {
      return errorResponse(error.message, 400);
    }
    return catchApiError(request, error, "기록 저장에 실패했습니다.", {
      userId: userId!,
    });
  }
};
