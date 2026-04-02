import { Metadata, NextPage } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import LoginPage from "./_source/components/LoginPage";

export const metadata: Metadata = getSharedMetadata({
  title: "로그인",
});

const Page: NextPage = () => {
  return <LoginPage />;
};

export default Page;
