import { Metadata } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({
  title: "알림",
});

const NotificationsLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return children;
};

export default NotificationsLayout;
