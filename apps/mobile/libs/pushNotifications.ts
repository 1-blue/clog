import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

let notificationHandlerConfigured = false;

/** 포그라운드 수신 시 표시 방식 (앱 전역 1회) */
export const ensurePushNotificationHandler = () => {
  if (notificationHandlerConfigured) return;
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
  if (Platform.OS !== "android") return;

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
    await ensureDefaultAndroidChannel();

    if (!Device.isDevice) {
      return {
        ok: false,
        reason: "실기기에서만 푸시 토큰을 발급할 수 있습니다.",
      };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
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
        reason: "EAS projectId를 찾을 수 없습니다. app.json extra.eas.projectId를 확인하세요.",
      };
    }

    try {
      const { data: expoPushToken } =
        await Notifications.getExpoPushTokenAsync({ projectId });
      return { ok: true, expoPushToken };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { ok: false, reason: message };
    }
  };
