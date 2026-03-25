import { Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import SettingsMain from "./_components/settings/SettingsMain";
import SettingsMainSkeleton from "./_components/settings/SettingsMainSkeleton";

export const revalidate = 0;

export const metadata: Metadata = getSharedMetadata({
  title: "설정",
  keywords: ["설정", "계정", "Clog"],
});

const SettingsPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/users/me"),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SettingsMainSkeleton />}>
        <SettingsMain />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SettingsPage;
