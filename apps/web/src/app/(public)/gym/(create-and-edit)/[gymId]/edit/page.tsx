import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GymEditPage from "./_source/components/GymEditPage";

export const metadata: Metadata = getSharedMetadata({
  title: "암장 수정",
});

interface IProps {
  params: Promise<{ gymId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { gymId } = await params;

  return <GymEditPage gymId={gymId} />;
};

export default Page;
