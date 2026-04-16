import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";

import { fetchClient, openapi } from "#web/apis/openapi";
import { requireAuth } from "#web/libs/api";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import GymReviewSkeleton from "../../_source/components/gym-review/skeleton/GymReviewSkeleton";
import GymReviewEditMain from "./_source/components/GymReviewEditMain";

export const revalidate = 0;

interface IProps {
  params: Promise<{ gymId: string; reviewId: string }>;
}

const getGymMeta = cache(async (gymId: string) => {
  const { data, error, response } = await fetchClient.GET(
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
  );
  if (error || response.status !== 200 || !data?.payload) return null;
  return data.payload;
});

/** 리뷰 소유권 확인 (서버측 IDOR 방지) */
const verifyReviewOwnership = cache(async (gymId: string, reviewId: string) => {
  const { userId } = await requireAuth();
  if (!userId) return false;

  const { data, error } = await fetchClient.GET(
    "/api/v1/gyms/{gymId}/reviews/{reviewId}",
    { params: { path: { gymId, reviewId } } },
  );
  if (error || !data?.payload) return false;

  return (data.payload as { userId?: string }).userId === userId;
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { gymId } = await params;
  const payload = await getGymMeta(gymId);
  if (!payload) {
    return getSharedMetadata({ title: "리뷰 수정" });
  }
  return getSharedMetadata({
    title: `${payload.name} · 리뷰 수정`,
    keywords: [payload.name, "암장 리뷰"],
  });
};

const GymReviewEditPage: NextPage<IProps> = async (props) => {
  const { gymId, reviewId } = await props.params;

  const exists = await getGymMeta(gymId);
  if (!exists) notFound();

  const isOwner = await verifyReviewOwnership(gymId, reviewId);
  if (!isOwner) notFound();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/gyms/{gymId}", {
      params: { path: { gymId } },
    }),
  );
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/gyms/{gymId}/reviews/{reviewId}", {
      params: { path: { gymId, reviewId } },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<GymReviewSkeleton />}>
        <GymReviewEditMain gymId={gymId} reviewId={reviewId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default GymReviewEditPage;
