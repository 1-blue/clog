import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";

import { fetchClient, openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import GymReviewMain from "../_source/components/gym-review/GymReviewMain";
import GymReviewSkeleton from "../_source/components/gym-review/skeleton/GymReviewSkeleton";

export const revalidate = 0;

interface IProps {
  params: Promise<{ gymId: string }>;
}

const getGymMeta = cache(async (gymId: string) => {
  const { data, error, response } = await fetchClient.GET(
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
  );
  if (error || response.status !== 200 || !data?.payload) return null;
  return data.payload;
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { gymId } = await params;
  const payload = await getGymMeta(gymId);

  if (!payload) return getSharedMetadata({ title: "리뷰 작성" });

  return getSharedMetadata({
    title: `${payload.name} · 리뷰 작성`,
    keywords: [payload.name, "암장 리뷰"],
  });
};

const GymReviewCreatePage: NextPage<IProps> = async (props) => {
  const { gymId } = await props.params;

  const exists = await getGymMeta(gymId);
  if (!exists) notFound();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/gyms/{gymId}", {
      params: { path: { gymId } },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<GymReviewSkeleton />}>
        <GymReviewMain gymId={gymId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default GymReviewCreatePage;
