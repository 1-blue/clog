import type { PostCategory } from "@clog/db";
import { categoryToKoreanMap } from "@clog/utils";

import { ROUTES } from "#web/constants/routes";

import { fireSlackNotify } from "../postMessage";
import { slackChannelIds } from "./channels";

const clientBaseUrl = () =>
  process.env.NEXT_PUBLIC_CLIENT_URL?.replace(/\/$/, "") ?? "";

const postLinkLine = (postId: string) => {
  const base = clientBaseUrl();
  const path = ROUTES.COMMUNITY.DETAIL.path(postId);
  if (base) return `🔗 <${base}${path}|게시글 열기>`;
  return `🔗 경로: \`${path}\` (NEXT_PUBLIC_CLIENT_URL 미설정)`;
};

const truncate = (s: string, max: number) => {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
};

const categoryLabel = (c: PostCategory) =>
  categoryToKoreanMap[c as keyof typeof categoryToKoreanMap] ?? c;

/** 게시글 등록 */
export const notifySlackPostCreated = (input: {
  nickname: string;
  userId: string;
  postId: string;
  category: PostCategory;
  title: string;
  content: string;
  tags?: string[];
}) => {
  console.log("🐬 notifySlackPostCreated >> ", input);

  const tagLine =
    input.tags && input.tags.length > 0
      ? [`#️⃣ 태그: ${input.tags.map((t) => `\`${t}\``).join(", ")}`, ""]
      : [];
  const lines = [
    "📝 *커뮤니티 · 새 글*",
    "",
    `👤 작성자: \`${input.nickname}\` (\`${input.userId}\`)`,
    `🏷️ 카테고리: *${categoryLabel(input.category)}*`,
    `📌 제목: ${input.title}`,
    ...tagLine,
    "📄 내용",
    "```",
    truncate(input.content, 800),
    "```",
    "",
    postLinkLine(input.postId),
  ];

  fireSlackNotify(slackChannelIds().community, lines.join("\n"));
};

/** 게시글 수정 */
export const notifySlackPostUpdated = (input: {
  nickname: string;
  userId: string;
  postId: string;
  category: PostCategory;
  title: string;
  content: string;
  tags?: string[];
}) => {
  const tagLine =
    input.tags && input.tags.length > 0
      ? [`#️⃣ 태그: ${input.tags.map((t) => `\`${t}\``).join(", ")}`, ""]
      : [];
  const lines = [
    "✏️ *커뮤니티 · 글 수정*",
    "",
    `👤 수정자: \`${input.nickname}\` (\`${input.userId}\`)`,
    `🏷️ 카테고리: *${categoryLabel(input.category)}*`,
    `📌 제목: ${input.title}`,
    ...tagLine,
    "📄 내용",
    "```",
    truncate(input.content, 800),
    "```",
    "",
    postLinkLine(input.postId),
  ];
  fireSlackNotify(slackChannelIds().community, lines.join("\n"));
};
