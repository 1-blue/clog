import type { Metadata, NextPage } from "next";
import ProfileEditPage from "./_source/components/ProfileEditPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "프로필 수정" });

const Page: NextPage = () => {
  return <ProfileEditPage />;
};

export default Page;
