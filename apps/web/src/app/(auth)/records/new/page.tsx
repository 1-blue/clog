import { cache } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { prefetchGymsForRecordForm } from "#web/app/(auth)/records/_source/components/record-form-prefetch";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import RecordNewMain from "./_components/record-new/RecordNewMain";

export const revalidate = 0;

const prefetchRecordForm = cache(async () => {
  const queryClient = getQueryClient();
  await prefetchGymsForRecordForm(queryClient);
});

export const generateMetadata = async (): Promise<Metadata> => {
  await prefetchRecordForm();
  return getSharedMetadata({
    title: "기록 추가",
    keywords: ["기록", "클라이밍", "세션"],
  });
};

const RecordNewPage = async () => {
  await prefetchRecordForm();
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecordNewMain />
    </HydrationBoundary>
  );
};

export default RecordNewPage;
