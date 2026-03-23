import { Platform } from "react-native";

// Android 에뮬레이터에서 localhost는 에뮬레이터 자신을 가리킴
// 호스트 머신 접근 시 10.0.2.2 사용
const DEV_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const DEV_URL = `http://${DEV_HOST}:9001`;

// TODO: 환경변수 EXPO_PUBLIC_WEB_URL (프로덕션 배포 시 실제 웹앱 URL로 변경)
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || DEV_URL;
