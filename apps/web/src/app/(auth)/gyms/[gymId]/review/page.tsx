import type { Metadata, NextPage } from "next";
import { redirect } from "next/navigation";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({
  title: "리뷰",
});

interface IProps {
  params: Promise<{ gymId: string }>;
}

const LegacyGymReviewRedirect: NextPage<IProps> = async (props) => {
  const { gymId } = await props.params;
  redirect(`/gyms/${gymId}/review/create`);
};

export default LegacyGymReviewRedirect;
