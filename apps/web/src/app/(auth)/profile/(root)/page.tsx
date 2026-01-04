import type { Metadata, NextPage } from "next";
import ProfilePage from "./_source/components/ProfilePage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "프로필" });

const Page: NextPage = () => {
  return <ProfilePage />;
};

export default Page;
