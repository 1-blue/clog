const SLACK_CHAT_POST = "https://slack.com/api/chat.postMessage";

type TSlackPostResult = { ok: boolean; error?: string };

/** Slack `chat.postMessage` — 토큰·채널 미설정 시 no-op */
export const slackPostMessage = async (
  channel: string | undefined,
  text: string,
) => {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token?.trim() || !channel?.trim()) return;

  const res = await fetch(SLACK_CHAT_POST, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      channel: channel.trim(),
      text,
      mrkdwn: true,
    }),
  });

  const data = (await res.json()) as TSlackPostResult;
  if (!data.ok) {
    console.error("[slack] chat.postMessage failed:", data.error ?? res.status);
  }
};

/** 알림 실패가 API 응답에 영향 없도록 fire-and-forget */
export const fireSlackNotify = (channel: string | undefined, text: string) => {
  console.log("🐬 fireSlackNotify channel, text >> ", channel, text);

  slackPostMessage(channel, text).catch((err: unknown) => {
    console.error("[slack] notify error:", err);
  });
};
