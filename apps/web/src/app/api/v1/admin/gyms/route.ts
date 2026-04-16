import { adminGymQuerySchema, createGymSchema } from "@clog/contracts";
import type { Prisma } from "@clog/db";
import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import {
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAdmin,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 어드민 — 암장 목록 */
export const GET = async (request: Request) => {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = adminGymQuerySchema.parse(params);

    const where: Prisma.GymWhereInput = {
      ...(query.region && { region: query.region }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { address: { contains: query.search, mode: "insensitive" } },
        ],
      }),
      ...(query.status === "active" && { isClosed: false }),
      ...(query.status === "closed" && { isClosed: true }),
    };

    const rows = await prisma.gym.findMany({
      where,
      orderBy: [{ isClosed: "asc" }, { name: "asc" }],
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    });

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;
    return paginatedJson(items, nextCursor);
  } catch (e) {
    return catchApiError(request, e, "암장 목록을 불러올 수 없습니다.");
  }
};

/** 어드민 — 암장 생성 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createGymSchema.parse(body);

    const gym = await prisma.$transaction(async (tx) => {
      const created = await tx.gym.create({
        data: {
          ...data,
          facilities: data.facilities ?? [],
        },
      });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "CREATE",
          targetType: "Gym",
          targetId: created.id,
          targetLabel: created.name,
          after: created,
          request,
        },
        tx,
      );
      return created;
    });

    return jsonWithToast(gym, "암장이 생성되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "암장 생성에 실패했습니다.");
  }
};
