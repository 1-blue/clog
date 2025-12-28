import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 개발 환경에서 자동으로 적절한 BASE URL을 반환
 * - Android 에뮬레이터: 10.0.2.2 (호스트의 localhost)
 * - iOS 시뮬레이터: localhost
 * - 실제 기기: Metro bundler의 hostUri에서 IP 자동 감지
 * - 프로덕션: 환경변수 또는 기본값 사용
 */
export const getBaseUrl = (): string => {
  // 환경변수가 있으면 우선 사용
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // 프로덕션 환경
  if (!__DEV__) {
    return "https://api.clog.app";
  }

  // 개발 환경: Metro bundler의 hostUri에서 IP 자동 감지
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    // hostUri 형식: "192.168.25.47:8081" -> "http://192.168.25.47:3000"
    const [host] = hostUri.split(":");
    return `http://${host}:3000`;
  }

  // hostUri가 없으면 플랫폼별 기본값 사용
  if (Platform.OS === "android") {
    // Android 에뮬레이터는 10.0.2.2 사용
    return "http://10.0.2.2:3000";
  }

  // iOS 시뮬레이터는 localhost 사용
  if (Platform.OS === "ios") {
    return "http://localhost:3000";
  }

  // 기본값
  return "http://localhost:3000";
};
