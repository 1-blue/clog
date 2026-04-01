import { Metadata, NextPage } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import NotificationListSection from "./_source/components/NotificationListSection";

export const metadata: Metadata = getSharedMetadata({
  title: "알림",
});

const NotificationsPage: NextPage = () => {
  return <NotificationListSection />;
};

export default NotificationsPage;
