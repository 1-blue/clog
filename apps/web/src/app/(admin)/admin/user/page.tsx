import type { Metadata, NextPage } from "next";
import AdminUserPage from "./_source/components/AdminUsersPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "사용자 관리" });

const Page: NextPage = () => {
  return <AdminUserPage />;
};

export default Page;
