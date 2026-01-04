import type { Metadata, NextPage } from "next";
import PassCreatePage from "./_source/components/PassCreatePage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "회원권 생성" });

const Page: NextPage = () => {
  return <PassCreatePage />;
};

export default Page;
