import { redirect } from "next/navigation";

import { prisma } from "@clog/db/prisma";

import { getAuthUserId } from "#web/libs/api";

/** 서버 컴포넌트에서 관리자 권한 확인. 미인증/비관리자 시 리다이렉트 */
export const requireAdminPage = async () => {
  const userId = await getAuthUserId();
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, nickname: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/");
  return user;
};
