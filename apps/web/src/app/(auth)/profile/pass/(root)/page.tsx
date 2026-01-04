import { Metadata, NextPage } from "next";
import PassPage from "./_source/components/PassPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "회원권 관리" });

const Page: NextPage = () => {
  return <PassPage />;
};

export default Page;
