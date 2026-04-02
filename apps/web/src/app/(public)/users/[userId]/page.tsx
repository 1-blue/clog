import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache, Suspense } from "react";
import type { Metadata, NextPage } from "next";
import { notFound } from "next/navigation";

import { fetchClient, openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import UserProfileMain from "./_components/profile-main/UserProfileMain";
import UserProfileSkeleton from "./_components/profile-main/UserProfileSkeleton";

export const revalidate = 0;

interface IProps {
  params: Promise<{ userId: string }>;
}

const getUserMeta = cache(async (userId: string) => {
  const { data, error, response } = await fetchClient.GET(
    "/api/v1/users/{userId}",
    { params: { path: { userId } } },
  );
  if (error || response.status !== 200 || !data?.payload) return null;
  return data.payload;
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { userId } = await params;
  const payload = await getUserMeta(userId);
  if (!payload) {
    return getSharedMetadata({ title: "프로필" });
  }

  return getSharedMetadata({
    title: `${payload.nickname} · 프로필`,
    keywords: [payload.nickname, "프로필"],
  });
};

const UserProfilePage: NextPage<IProps> = async (props) => {
  const { userId } = await props.params;

  const exists = await getUserMeta(userId);
  if (!exists) notFound();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/users/{userId}", {
      params: { path: { userId } },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileMain userId={userId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default UserProfilePage;
