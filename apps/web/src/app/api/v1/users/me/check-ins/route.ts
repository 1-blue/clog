import { prisma } from "@clog/db/prisma";

import { json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { isCheckInEligibleForSession } from "#web/libs/record/sessionFromCheckIn";

const LINKABLE_TAKE = 80;

/** 내 체크인 목록 (연결 가능만 필터 시 30분 이상·미연결) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const linkableOnly = searchParams.get("linkableOnly") === "true";
  const forSessionId = searchParams.get("forSessionId");

  try {
    if (linkableOnly) {
      let linkableWhere:
        | {
            userId: string;
            endedAt: { not: null };
            OR: [
              { linkedSession: { is: null } },
              { linkedSession: { id: string } },
            ];
          }
        | {
            userId: string;
            endedAt: { not: null };
            linkedSession: { is: null };
          };

      if (forSessionId) {
        const session = await prisma.climbingSession.findFirst({
          where: { id: forSessionId, userId: userId! },
          select: { id: true },
        });
        if (session) {
          linkableWhere = {
            userId: userId!,
            endedAt: { not: null },
            OR: [
              { linkedSession: { is: null } },
              { linkedSession: { id: session.id } },
            ],
          };
        } else {
          linkableWhere = {
            userId: userId!,
            endedAt: { not: null },
            linkedSession: { is: null },
          };
        }
      } else {
        linkableWhere = {
          userId: userId!,
          endedAt: { not: null },
          linkedSession: { is: null },
        };
      }

      const rows = await prisma.gymCheckIn.findMany({
        where: linkableWhere,
        include: {
          gym: { select: { id: true, name: true } },
        },
        orderBy: { endedAt: "desc" },
        take: LINKABLE_TAKE,
      });

      const filtered = rows.filter(
        (r) =>
          r.endedAt !== null &&
          isCheckInEligibleForSession(r.startedAt, r.endedAt),
      );

      return json({
        items: filtered.map((r) => ({
          id: r.id,
          gymId: r.gymId,
          gymName: r.gym.name,
          startedAt: r.startedAt,
          endedAt: r.endedAt!,
        })),
      });
    }

    const rows = await prisma.gymCheckIn.findMany({
      where: { userId: userId! },
      include: {
        gym: { select: { id: true, name: true } },
      },
      orderBy: { startedAt: "desc" },
      take: 50,
    });

    return json({
      items: rows.map((r) => ({
        id: r.id,
        gymId: r.gymId,
        gymName: r.gym.name,
        startedAt: r.startedAt,
        endsAt: r.endsAt,
        endedAt: r.endedAt,
      })),
    });
  } catch (err) {
    return catchApiError(request, err, "체크인 목록을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
