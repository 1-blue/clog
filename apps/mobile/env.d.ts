declare namespace NodeJS {
  interface ProcessEnv {
    /** 프로덕션·실기기: 웹앱 origin (미설정 시 개발용 기본 호스트 사용) */
    EXPO_PUBLIC_WEB_URL?: string;
    /** 네이티브 구글 로그인 — `GoogleSignin.configure({ webClientId })`, 서버 `GOOGLE_CLIENT_ID`와 동일 */
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
  }
}
