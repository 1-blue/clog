import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { getRecordPayloadCached } from "#web/app/(auth)/records/_source/components/getRecordPayloadCached";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import RecordDetailMain from "./_components/record-detail/RecordDetailMain";
import RecordDetailSkeleton from "./_components/record-detail/RecordDetailSkeleton";

export const revalidate = 0;

interface IProps {
  params: Promise<{ recordId: string }>;
}

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { recordId } = await params;
  const payload = await getRecordPayloadCached(recordId);
  if (!payload) {
    return getSharedMetadata({ title: "기록 상세" });
  }
  return getSharedMetadata({
    title: `기록 · ${payload.gym.name}`,
    keywords: [payload.gym.name, "클라이밍 기록"],
  });
};

const prefetchMe = cache(async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/users/me"),
  );
});

const RecordDetailPage: NextPage<IProps> = async (props) => {
  const { recordId } = await props.params;

  const exists = await getRecordPayloadCached(recordId);
  if (!exists) notFound();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/records/{recordId}", {
      params: { path: { recordId } },
    }),
  );
  await prefetchMe();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecordDetailSkeleton />}>
        <RecordDetailMain recordId={recordId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default RecordDetailPage;
