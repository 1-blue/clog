import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GymDetailPage from "./_source/components/GymDetailPage";

export const metadata: Metadata = getSharedMetadata({
  title: "암장 상세",
});

interface IProps {
  params: Promise<{ gymId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { gymId } = await params;

  return <GymDetailPage gymId={gymId} />;
};

export default Page;
