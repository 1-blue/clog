import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import type { Metadata, NextPage } from "next";
import AdminPage from "./_source/components/AdminPage";

export const metadata: Metadata = getSharedMetadata({ title: "관리자" });

const Page: NextPage = () => {
  return <AdminPage />;
};

export default Page;
