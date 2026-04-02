/** Slack 알림용 채널 ID (env) */
export const slackChannelIds = () => ({
  signup: process.env.SLACK_CHANNEL_SIGNUP,
  community: process.env.SLACK_CHANNEL_COMMUNITY,
  checkIn: process.env.SLACK_CHANNEL_CHECKIN,
});
