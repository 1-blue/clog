import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import PostDetailMain from "./_components/PostDetailMain";

interface IProps {
  params: Promise<{ postId: string }>;
}

const prefetchPost = cache((postId: string) => {
  const queryClient = getQueryClient();
  return queryClient.fetchQuery(
    openapi.queryOptions("get", "/api/v1/posts/{postId}", {
      params: { path: { postId } },
    }),
  );
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { postId } = await params;
  try {
    const { payload } = await prefetchPost(postId);
    return getSharedMetadata({
      title: payload.title,
      description: payload.content.slice(0, 120),
      keywords: [payload.title],
    });
  } catch {
    return getSharedMetadata({ title: "게시글" });
  }
};

const PostDetailPage: NextPage<IProps> = async (props) => {
  const { postId } = await props.params;
  const queryClient = getQueryClient();

  try {
    await prefetchPost(postId);
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailMain postId={postId} />
    </HydrationBoundary>
  );
};

export default PostDetailPage;
