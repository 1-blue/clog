import { PushPlatform } from "@prisma/client";
import Expo from "expo-server-sdk";

import { prisma } from "@clog/db/prisma";

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

export type TSendExpoPushInput = {
  /** 알림 수신자 Prisma user id */
  recipientUserId: string;
  title: string;
  body: string;
  /** 딥링크·라우팅용 (문자열 값만) */
  data?: Record<string, string | undefined>;
};

/** Expo Push 발송 — 푸시 허용·ANDROID 토큰이 있을 때만 전송. 무효 토큰은 DB에서 제거 */
export const sendExpoPush = async (input: TSendExpoPushInput) => {
  const user = await prisma.user.findUnique({
    where: { id: input.recipientUserId },
    select: {
      pushNotificationsEnabled: true,
      pushDevices: {
        where: { platform: PushPlatform.ANDROID },
        select: { expoPushToken: true },
      },
    },
  });

  if (!user?.pushNotificationsEnabled) return;

  const tokens = user.pushDevices
    .map((d) => d.expoPushToken)
    .filter((t) => Expo.isExpoPushToken(t));

  if (tokens.length === 0) return;

  const dataPayload: Record<string, unknown> = {};
  if (input.data) {
    for (const [k, v] of Object.entries(input.data)) {
      if (v !== undefined) dataPayload[k] = v;
    }
  }

  const messages = tokens.map((to) => ({
    to,
    sound: "default" as const,
    title: input.title,
    body: input.body,
    data: dataPayload,
  }));

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    const tickets = await expo.sendPushNotificationsAsync(chunk);

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      const msg = chunk[i];
      if (!ticket || ticket.status !== "error" || !msg) continue;

      const err = ticket.details?.error;
      const tokenFromDetails = ticket.details?.expoPushToken;
      const tokenFromMsg = typeof msg.to === "string" ? msg.to : undefined;
      const token = tokenFromDetails ?? tokenFromMsg;

      if (err === "DeviceNotRegistered" && token) {
        await prisma.userPushDevice.deleteMany({
          where: { expoPushToken: token },
        });
      }
    }
  }
};
