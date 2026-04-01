import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import type { Metadata } from "next";

import type { components } from "#web/@types/openapi";
import { fetchClient } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import CommunityMain from "./_components/CommunityMain";

export const revalidate = 0;

type PaginatedPosts = components["schemas"]["PaginatedPostListItem"];

const prefetchInitialPosts = cache(async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get", "/api/v1/posts", { category: "" }],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET("/api/v1/posts", {
        params: {
          query: {
            cursor: pageParam,
            limit: 20,
          },
        },
      });
      return data!.payload;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PaginatedPosts) => lastPage.nextCursor,
  });
});

export const generateMetadata = async (): Promise<Metadata> => {
  await prefetchInitialPosts();
  return getSharedMetadata({
    title: "커뮤니티",
    keywords: ["커뮤니티", "클라이밍"],
  });
};

const CommunityPage = async () => {
  const queryClient = getQueryClient();
  await prefetchInitialPosts();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityMain />
    </HydrationBoundary>
  );
};

export default CommunityPage;
