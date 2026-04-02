declare namespace NodeJS {
  interface ProcessEnv {
    /** API URL */
    NEXT_PUBLIC_API_URL: string;
    /** Client URL */
    NEXT_PUBLIC_CLIENT_URL: string;

    /** Supabase URL */
    NEXT_PUBLIC_SUPABASE_URL: string;
    /** Supabase Anon Key */
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    /** AWS S3 업로드 */
    APP_AWS_REGION: string;
    /** AWS S3 엑세스 키 */
    APP_AWS_ACCESS_KEY: string;
    /** AWS S3 비밀 엑세스 키 */
    APP_AWS_SECRET_ACCESS_KEY: string;
    /** AWS S3 Bucket */
    APP_AWS_S3_BUCKET: string;

    /** KAKAO MAP APPKEY */
    NEXT_PUBLIC_KAKAO_MAP_APPKEY: string;

    /** Slack Bot User OAuth Token (xoxb-...) — 서버 전용 */
    SLACK_BOT_TOKEN?: string;
    /** Slack 채널 ID — 회원가입·탈퇴 알림 */
    SLACK_CHANNEL_SIGNUP?: string;
    /** Slack 채널 ID — 커뮤니티 게시글 알림 */
    SLACK_CHANNEL_COMMUNITY?: string;
    /** Slack 채널 ID — 체크인·체크아웃 알림 */
    SLACK_CHANNEL_CHECKIN?: string;
  }
}
