/** Slack 알림용 채널 ID (env) */
export const slackChannelIds = () => ({
  user: process.env.SLACK_CHANNEL_USER,
  community: process.env.SLACK_CHANNEL_COMMUNITY,
  checkIn: process.env.SLACK_CHANNEL_CHECKIN,
  error: process.env.SLACK_CHANNEL_ERROR,
});
