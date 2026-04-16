import { notFound } from "next/navigation";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";

import GymEditPanel from "./_source/components/GymEditPanel";

interface IProps {
  params: Promise<{ gymId: string }>;
}

const GymDetailPage = async ({ params }: IProps) => {
  const { gymId } = await params;
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) notFound();

  return (
    <>
      <AdminPageHeader title={gym.name} description={gym.address} />
      <GymEditPanel gym={gym} />
    </>
  );
};

export default GymDetailPage;
