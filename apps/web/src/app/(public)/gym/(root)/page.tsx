import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GymPage from "./_source/components/GymPage";

export const metadata: Metadata = getSharedMetadata({
  title: "암장",
});

const Page: NextPage = () => {
  return <GymPage />;
};

export default Page;
