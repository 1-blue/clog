import { formatKoreaMonthDayTimeHm } from "#web/libs/date/korea";

import { fireSlackNotify } from "../postMessage";
import { slackChannelIds } from "./channels";

/** 체크인 */
export const notifySlackCheckIn = (input: {
  nickname: string;
  userId: string;
  gymName: string;
  gymId: string;
  at: Date;
  endsAt: Date;
}) => {
  const lines = [
    "🧗 *체크인*",
    "",
    `👤 \`${input.nickname}\` (\`${input.userId}\`)`,
    `🏢 암장: *${input.gymName}* (\`${input.gymId}\`)`,
    `⏰ 시각: ${formatKoreaMonthDayTimeHm(input.at)}`,
    `⏳ 자동 종료 예정: ${formatKoreaMonthDayTimeHm(input.endsAt)}`,
  ];
  fireSlackNotify(slackChannelIds().checkIn, lines.join("\n"));
};

/** 체크아웃 */
export const notifySlackCheckOut = (input: {
  nickname: string;
  userId: string;
  gymName: string;
  gymId: string;
  at: Date;
}) => {
  const lines = [
    "🚪 *체크아웃*",
    "",
    `👤 \`${input.nickname}\` (\`${input.userId}\`)`,
    `🏢 암장: *${input.gymName}* (\`${input.gymId}\`)`,
    `⏰ 시각: ${formatKoreaMonthDayTimeHm(input.at)}`,
  ];
  fireSlackNotify(slackChannelIds().checkIn, lines.join("\n"));
};
