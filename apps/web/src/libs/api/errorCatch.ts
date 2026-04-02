import { ZodError } from "zod";

import { prisma } from "@clog/db";

import { errorResponse, getAuthUserId } from "#web/libs/api";
import { notifySlackApiError } from "#web/libs/slack/notifications";

const TRACE_HEADER_KEYS = ["x-trace-id", "x-request-id"] as const;

export const getRequestEndpoint = (
  request: Request,
): { method: string; path: string; endpoint: string } => {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;
  return { method, path, endpoint: `${method} ${path}` };
};

export const resolveTraceId = (request: Request): string => {
  for (const key of TRACE_HEADER_KEYS) {
    const v = request.headers.get(key)?.trim();
    if (v) return v;
  }
  return crypto.randomUUID();
};

/** `undefined`: 세션에서 조회 / `null`: 비로그인 확정 */
export const resolveErrorUserId = async (
  explicit: string | null | undefined,
): Promise<string | null> => {
  if (explicit !== undefined) return explicit;
  return getAuthUserId();
};

export const serializeError = (
  error: unknown,
): { name?: string; message: string; stack?: string; errorLog: string } => {
  if (error instanceof ZodError) {
    const issues = error.issues.map((i) => ({
      path: i.path.join("."),
      code: i.code,
      message: i.message,
    }));
    const body = JSON.stringify({ type: "ZodError", issues }, null, 2);
    return {
      name: "ZodError",
      message: error.message,
      stack: error.stack,
      errorLog: [error.message, error.stack, body].filter(Boolean).join("\n\n"),
    };
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errorLog: [error.name + ": " + error.message, error.stack]
        .filter(Boolean)
        .join("\n\n"),
    };
  }
  const message =
    typeof error === "string" ? error : JSON.stringify(error, null, 2);
  return { message, errorLog: message };
};

/**
 * API Route `catch` 공통: DB 기록 + Slack + 클라이언트 에러 응답
 * - `options.userId` 생략 시 `getAuthUserId()` 호출, `null`이면 비로그인으로 확정
 */
export const catchApiError = async (
  request: Request,
  error: unknown,
  clientMessage: string,
  options?: { status?: number; userId?: string | null },
): Promise<ReturnType<typeof errorResponse>> => {
  const httpStatus = options?.status ?? 400;
  const { method, path, endpoint } = getRequestEndpoint(request);
  const traceId = resolveTraceId(request);
  const userId = await resolveErrorUserId(options?.userId);
  const s = serializeError(error);
  const errorName = s.name ?? null;
  const { message, stack, errorLog } = s;

  let logId = "";
  try {
    const row = await prisma.apiErrorLog.create({
      data: {
        method,
        path,
        endpoint,
        errorLog,
        userId,
        httpStatus,
        clientMessage,
        errorName,
        traceId,
      },
    });
    logId = row.id;
  } catch {
    logId = traceId;
  }

  notifySlackApiError({
    logId: logId || traceId,
    endpoint,
    traceId,
    userId,
    clientMessage,
    httpStatus,
    errorPreview: [errorName, message, stack].filter(Boolean).join("\n"),
  });

  return errorResponse(clientMessage, httpStatus);
};
