import { AdminAuditAction, type Prisma } from "@clog/db";
import { prisma } from "@clog/db/prisma";

export { AdminAuditAction };

type TTxClient = Prisma.TransactionClient;

interface IAuditParams {
  actorId: string;
  action: AdminAuditAction;
  targetType: string;
  targetId: string;
  targetLabel?: string | null;
  before?: unknown;
  after?: unknown;
  note?: string | null;
  request?: Request;
}

const extractRequestMeta = (request: Request) => {
  const headers = request.headers;
  return {
    userAgent: headers.get("user-agent"),
    ip:
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headers.get("x-real-ip"),
    traceId: headers.get("x-trace-id"),
  };
};

const toJson = (
  value: unknown,
): Prisma.InputJsonValue | typeof Prisma.JsonNull => {
  if (value === undefined || value === null)
    return null as unknown as typeof Prisma.JsonNull;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
};

/** 어드민 감사 로그 기록. 트랜잭션 클라이언트 주입 시 원자 기록. */
export const logAdminAudit = async (params: IAuditParams, tx?: TTxClient) => {
  const client = tx ?? prisma;
  await client.adminAuditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      targetLabel: params.targetLabel ?? null,
      before: toJson(params.before),
      after: toJson(params.after),
      note: params.note ?? null,
      requestMeta: params.request
        ? (toJson(extractRequestMeta(params.request)) as Prisma.InputJsonValue)
        : (null as unknown as Prisma.InputJsonValue),
    },
  });
};
