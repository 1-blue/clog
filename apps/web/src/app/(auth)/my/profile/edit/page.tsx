import { Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import ProfileEditMain from "./_components/profile-edit/ProfileEditMain";
import ProfileEditMainSkeleton from "./_components/profile-edit/ProfileEditMainSkeleton";

export const revalidate = 0;

export const metadata: Metadata = getSharedMetadata({
  title: "프로필 수정",
  keywords: ["프로필", "닉네임", "설정"],
});

const ProfileEditPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/users/me"),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProfileEditMainSkeleton />}>
        <ProfileEditMain />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProfileEditPage;
