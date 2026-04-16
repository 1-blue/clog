import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

/**
 * Expo Go 환경 여부.
 *
 * Constants.appOwnership은 SDK 49부터 deprecated 되어 신뢰할 수 없으므로
 * executionEnvironment를 사용한다.
 */
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * expo-notifications 모듈.
 *
 * SDK 53부터 Expo Go(Android)에서는 expo-notifications의 푸시 기능이 제거되어
 * top-level `import` 자체가 throw 한다. 시뮬레이터/Expo Go에서도 앱이 뜨도록
 * `require`로 한 번만 가드 로드하고, Expo Go에서는 null로 둔다.
 *
 * 푸시 자체는 development build에서만 동작한다.
 */
type TNotifications = typeof import("expo-notifications");
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const Notifications: TNotifications | null = isExpoGo
  ? null
  : (require("expo-notifications") as TNotifications);

let notificationHandlerConfigured = false;

/** 포그라운드 수신 시 표시 방식 (앱 전역 1회) */
export const ensurePushNotificationHandler = () => {
  if (!Notifications || notificationHandlerConfigured) return;
  notificationHandlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

/** Android 8+ 알림 채널 — 권한/표시 전에 생성 */
export const ensureDefaultAndroidChannel = async () => {
  if (Platform.OS !== "android" || !Notifications) return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
};

export type TRegisterPushResult =
  | { ok: true; expoPushToken: string }
  | { ok: false; reason: string };

let registrationPromise: Promise<TRegisterPushResult> | null = null;

/** 동일 세션에서 중복 토큰 요청 방지 */
export const registerForPushNotificationsOnce =
  (): Promise<TRegisterPushResult> => {
    if (!registrationPromise) {
      registrationPromise = registerForPushNotificationsAsync();
    }
    return registrationPromise;
  };

const registerForPushNotificationsAsync =
  async (): Promise<TRegisterPushResult> => {
    if (!Notifications) {
      return {
        ok: false,
        reason:
          "Expo Go에서는 푸시 알림을 등록할 수 없습니다. development build를 사용하세요.",
      };
    }

    await ensureDefaultAndroidChannel();

    if (!Device.isDevice) {
      return {
        ok: false,
        reason: "실기기에서만 푸시 토큰을 발급할 수 있습니다.",
      };
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return { ok: false, reason: "알림 권한이 거부되었습니다." };
    }

    type TExpoExtra = { eas?: { projectId?: string } };
    const extra = Constants.expoConfig?.extra as TExpoExtra | undefined;
    const projectId =
      extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;

    if (!projectId) {
      return {
        ok: false,
        reason:
          "EAS projectId를 찾을 수 없습니다. app.json extra.eas.projectId를 확인하세요.",
      };
    }

    try {
      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
        { projectId },
      );
      return { ok: true, expoPushToken };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { ok: false, reason: message };
    }
  };
