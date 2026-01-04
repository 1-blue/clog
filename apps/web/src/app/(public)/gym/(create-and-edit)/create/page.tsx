import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GymCreatePage from "./_source/components/GymCreatePage";

export const metadata: Metadata = getSharedMetadata({
  title: "암장 생성",
});

const Page: NextPage = () => {
  return <GymCreatePage />;
};

export default Page;
