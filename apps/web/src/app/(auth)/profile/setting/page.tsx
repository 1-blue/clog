import type { Metadata, NextPage } from "next";
import ProfileSettingPage from "./_source/components/ProfileSettingPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "설정" });

const Page: NextPage = () => {
  return <ProfileSettingPage />;
};

export default Page;
