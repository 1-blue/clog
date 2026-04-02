import { fireSlackNotify } from "../postMessage";
import { slackChannelIds } from "./channels";

const truncate = (s: string, max: number): string => {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
};

export const notifySlackApiError = (input: {
  logId: string;
  endpoint: string;
  traceId: string;
  userId: string | null;
  clientMessage: string;
  httpStatus: number;
  errorPreview: string;
}): void => {
  const userLine = input.userId
    ? `👤 유저: \`${input.userId}\``
    : "👤 유저: 비로그인";
  const lines = [
    "🚨 *API 오류*",
    "",
    `🆔 logId: \`${input.logId}\``,
    `🔖 traceId: \`${input.traceId}\``,
    `📍 \`${input.endpoint}\``,
    `📊 HTTP: *${input.httpStatus}*`,
    userLine,
    `💬 응답 메시지: ${truncate(input.clientMessage, 200)}`,
    "",
    "```",
    truncate(input.errorPreview, 300),
    "```",
  ];
  fireSlackNotify(slackChannelIds().error, lines.join("\n"));
};
