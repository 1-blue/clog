import {
  formatLinkedProviders,
  type TLinkedProvider,
} from "#web/libs/auth/linkedProvidersFromSupabase";

import { fireSlackNotify } from "../postMessage";
import { slackChannelIds } from "./channels";

/** 신규 회원 (Prisma 최초 생성 시) */
export const notifySlackUserSignup = (input: {
  nickname: string;
  userId: string;
  email?: string | null;
  providers: TLinkedProvider[];
}) => {
  const lines = [
    "🎉 *신규 가입*",
    "",
    `👤 닉네임: \`${input.nickname}\``,
    `🆔 유저 ID: \`${input.userId}\``,
    ...(input.email ? [`📧 이메일: \`${input.email}\``] : []),
    `🔗 로그인: ${formatLinkedProviders(input.providers)}`,
  ];
  fireSlackNotify(slackChannelIds().signup, lines.join("\n"));
};

/** 회원 탈퇴 */
export const notifySlackUserWithdrawal = (input: {
  nickname: string;
  userId: string;
  email?: string | null;
  providers: TLinkedProvider[];
}) => {
  const lines = [
    "👋 *회원 탈퇴*",
    "",
    `👤 닉네임: \`${input.nickname}\``,
    `🆔 유저 ID: \`${input.userId}\``,
    ...(input.email ? [`📧 이메일: \`${input.email}\``] : []),
    `🔗 연동: ${formatLinkedProviders(input.providers)}`,
  ];
  fireSlackNotify(slackChannelIds().signup, lines.join("\n"));
};
