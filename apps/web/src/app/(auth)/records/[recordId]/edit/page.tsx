import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  prefetchGymsForRecordForm,
  prefetchRecordById,
} from "#web/app/(auth)/records/_source/components/record-form-prefetch";
import { getRecordPayloadCached } from "#web/app/(auth)/records/_source/components/getRecordPayloadCached";
import RecordFormPageSkeleton from "#web/app/(auth)/records/_source/components/RecordFormPageSkeleton";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import RecordEditMain from "./_components/record-edit/RecordEditMain";

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
    return getSharedMetadata({ title: "기록 수정" });
  }
  return getSharedMetadata({
    title: `기록 수정 · ${payload.gym.name}`,
    keywords: [payload.gym.name, "클라이밍 기록 수정"],
  });
};

const RecordEditPage: NextPage<IProps> = async (props) => {
  const { recordId } = await props.params;

  const exists = await getRecordPayloadCached(recordId);
  if (!exists) notFound();

  const queryClient = getQueryClient();
  await prefetchGymsForRecordForm(queryClient);
  await prefetchRecordById(queryClient, recordId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecordFormPageSkeleton />}>
        <RecordEditMain recordId={recordId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default RecordEditPage;
