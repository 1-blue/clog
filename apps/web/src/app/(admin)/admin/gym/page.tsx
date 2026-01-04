import type { Metadata, NextPage } from "next";
import AdminGymPage from "./_source/components/AdminGymPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "암장 관리" });

const Page: NextPage = () => {
  return <AdminGymPage />;
};

export default Page;
