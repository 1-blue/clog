import { Platform } from "react-native";

/**
 * 개발용 기본 호스트 (EXPO_PUBLIC_WEB_URL 미설정 시)
 * - Android 에뮬레이터: 10.0.2.2 → 호스트 PC의 localhost:9001
 * - Android 실기기: 10.0.2.2는 동작하지 않음 → .env에 PC LAN IP 필수
 *   예) EXPO_PUBLIC_WEB_URL=http://192.168.0.12:9001 (맥/PC와 폰이 같은 Wi‑Fi)
 * - iOS 시뮬레이터: localhost
 */
const DEV_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const DEV_URL = `http://${DEV_HOST}:9001`;

/** 프로덕션은 EXPO_PUBLIC_WEB_URL 로 실서비스 도메인 지정 */
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL || DEV_URL;
