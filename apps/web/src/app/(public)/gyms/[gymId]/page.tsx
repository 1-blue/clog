import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import GymDetailMain from "./_source/components/GymDetailMain";

interface IProps {
  params: Promise<{ gymId: string }>;
}

const prefetchGym = cache((gymId: string) => {
  const queryClient = getQueryClient();
  return queryClient.fetchQuery(
    openapi.queryOptions("get", "/api/v1/gyms/{gymId}", {
      params: { path: { gymId } },
    }),
  );
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { gymId } = await params;
  try {
    const { payload } = await prefetchGym(gymId);
    if (!payload?.name) {
      return getSharedMetadata({ title: "암장 상세" });
    }

    return getSharedMetadata({
      title: payload.name,
      description: payload.description ?? payload.address,
      keywords: [payload.name, payload.address].filter(Boolean) as string[],
    });
  } catch {
    return getSharedMetadata({ title: "암장 상세" });
  }
};

const GymDetailPage: NextPage<IProps> = async (props) => {
  const { gymId } = await props.params;
  const queryClient = getQueryClient();

  try {
    await prefetchGym(gymId);
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GymDetailMain gymId={gymId} />
    </HydrationBoundary>
  );
};

export default GymDetailPage;
