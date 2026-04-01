import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { fetchClient, openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import CommunityPostEditMain from "./_source/components/CommunityPostEditMain";

export const revalidate = 0;

interface IProps {
  params: Promise<{ postId: string }>;
}

const getPostExists = cache(async (postId: string) => {
  const { data, error, response } = await fetchClient.GET(
    "/api/v1/posts/{postId}",
    { params: { path: { postId } } },
  );
  if (error || response.status !== 200 || !data?.payload) return null;
  return data.payload;
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { postId } = await params;
  const post = await getPostExists(postId);
  if (!post) {
    return getSharedMetadata({ title: "게시글 수정" });
  }
  return getSharedMetadata({
    title: `게시글 수정 · ${post.title.slice(0, 40)}`,
    keywords: [post.title],
  });
};

const CommunityEditPostPage: NextPage<IProps> = async (props) => {
  const { postId } = await props.params;

  const exists = await getPostExists(postId);
  if (!exists) notFound();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/posts/{postId}", {
      params: { path: { postId } },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <CommunityPostEditMain postId={postId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CommunityEditPostPage;
