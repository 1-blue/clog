import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import MainPage from "./_source/components/MainPage";

export const metadata: Metadata = getSharedMetadata();

const Page: NextPage = () => {
  return <MainPage />;
};

export default Page;
