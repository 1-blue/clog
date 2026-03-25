declare namespace NodeJS {
  interface ProcessEnv {
    /** API URL */
    NEXT_PUBLIC_API_URL: string;

    /** Supabase URL */
    NEXT_PUBLIC_SUPABASE_URL: string;
    /** Supabase Anon Key */
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    /** AWS S3 업로드 */
    AWS_REGION: string;
    /** AWS S3 엑세스 키 */
    AWS_ACCESS_KEY: string;
    /** AWS S3 비밀 엑세스 키 */
    AWS_SECRET_ACCESS_KEY: string;
    /** AWS S3 Bucket */
    AWS_S3_BUCKET: string;

    /** KAKAO MAP APPKEY */
    NEXT_PUBLIC_KAKAO_MAP_APPKEY: string;
  }
}
