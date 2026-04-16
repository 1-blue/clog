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
    SLACK_BOT_TOKEN: string;
    /** Slack 채널 ID — 회원가입·탈퇴 알림 */
    SLACK_CHANNEL_USER: string;
    /** Slack 채널 ID — 커뮤니티 게시글 알림 */
    SLACK_CHANNEL_COMMUNITY: string;
    /** Slack 채널 ID — 체크인·체크아웃 알림 */
    SLACK_CHANNEL_CHECKIN: string;
    /** Slack 채널 ID — 에러 알림 */
    SLACK_CHANNEL_ERROR: string;

    /** GET /api/v1/health 에러 알림 테스트용 비밀값 (미설정 시 테스트 분기 비활성) */
    HEALTH_ERROR_TEST_SECRET: string;

    /** Expo Access Token */
    EXPO_ACCESS_TOKEN: string;

    /** Auth Secret */
    AUTH_SECRET: string;
    /** 배포·프록시 뒤에서 사용할 베이스 URL (선택, 미설정 시 요청 Host로 추론) */
    AUTH_URL?: string;
    /** 프록시 뒤에서 X-Forwarded-* 신뢰 (선택) */
    AUTH_TRUST_HOST?: string;
    /** Kakao REST API Key */
    KAKAO_REST_API_KEY: string;
    /** Kakao Secret Key */
    KAKAO_SECRET_KEY: string;
    /** Google Client ID */
    GOOGLE_CLIENT_ID: string;
    /** Google Client Secret */
    GOOGLE_CLIENT_SECRET: string;
  }
}
