import { notFound } from "next/navigation";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";

import UserEditPanel from "./_source/components/UserEditPanel";

interface IProps {
  params: Promise<{ userId: string }>;
}

const UserDetailPage = async ({ params }: IProps) => {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
    },
  });
  if (!user) notFound();

  return (
    <>
      <AdminPageHeader title={user.nickname} description={user.email} />
      <UserEditPanel user={user} />
    </>
  );
};

export default UserDetailPage;
