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
  }
}
