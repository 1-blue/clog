import type { NextPage } from "next";
import { redirect } from "next/navigation";

interface IProps {
  params: Promise<{ gymId: string }>;
}

/** 구 URL `/gyms/:gymId/review` → 작성 페이지로 */
const LegacyGymReviewRedirect: NextPage<IProps> = async (props) => {
  const { gymId } = await props.params;
  redirect(`/gyms/${gymId}/review/create`);
};

export default LegacyGymReviewRedirect;
