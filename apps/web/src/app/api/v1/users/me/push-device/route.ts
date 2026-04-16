import { PushPlatform } from "@prisma/client";

import {
  deletePushDeviceQuerySchema,
  registerPushDeviceSchema,
} from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import { getSearchParams, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

const platformToPrisma = {
  ANDROID: PushPlatform.ANDROID,
} as const;

/** Expo 푸시 토큰 등록·갱신 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { token, platform } = registerPushDeviceSchema.parse(body);
    const prismaPlatform = platformToPrisma[platform];

    const device = await prisma.userPushDevice.upsert({
      where: {
        userId_expoPushToken: {
          userId: userId!,
          expoPushToken: token,
        },
      },
      create: {
        userId: userId!,
        expoPushToken: token,
        platform: prismaPlatform,
      },
      update: {
        platform: prismaPlatform,
      },
    });

    return json(device);
  } catch (err) {
    return catchApiError(request, err, "푸시 토큰 등록에 실패했습니다.", {
      userId: userId!,
    });
  }
};

/** Expo 푸시 토큰 삭제 */
export const DELETE = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const { token } = deletePushDeviceQuerySchema.parse(
      getSearchParams(request),
    );

    await prisma.userPushDevice.deleteMany({
      where: { userId: userId!, expoPushToken: token },
    });

    return json(null);
  } catch (err) {
    return catchApiError(request, err, "푸시 토큰 삭제에 실패했습니다.", {
      userId: userId!,
    });
  }
};
