"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import AppTopBar from "#web/components/layout/AppTopBar";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";

import UserProfileActionRow from "./UserProfileActionRow";
import UserProfileActivityHeading from "./UserProfileActivityHeading";
import UserProfileBioLine from "./UserProfileBioLine";
import UserProfileHeatmap from "./UserProfileHeatmap";
import UserProfileHeroSection from "./UserProfileHeroSection";
import UserProfileRecordsSection from "./UserProfileRecordsSection";
import UserProfileSelectionCaption from "./UserProfileSelectionCaption";
import UserProfileStatsGrid from "./UserProfileStatsGrid";

interface IProps {
  userId: string;
}

const UserProfileMain = ({ userId }: IProps) => {
  const router = useRouter();

  const { data: user } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/{userId}",
    { params: { path: { userId } } },
    { select: (d) => d.payload },
  );

  const { data: me } = openapi.useQuery("get", "/api/v1/users/me", undefined, {
    retry: false,
    select: (d) => d.payload,
  });
  const isOwnProfile = me?.id === userId;
  const isFollowing = (user.followers?.length ?? 0) > 0;
  const { toggleFollowMutation } = useUserMutations();

  const [selectedYmd, setSelectedYmd] = useState<string | null>(null);

  const onToggleYmd = useCallback((ymd: string) => {
    setSelectedYmd((prev) => (prev === ymd ? null : ymd));
  }, []);

  return (
    <div className="pb-24">
      <AppTopBar
        left={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-9 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
              aria-label="뒤로"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <span className="text-lg font-semibold text-on-surface">프로필</span>
          </div>
        }
        right={
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
            aria-label="메뉴"
          >
            <MoreVertical className="size-5" strokeWidth={2} />
          </button>
        }
      />

      <main className="mx-auto max-w-lg">
        <UserProfileHeroSection user={user} />
        <div className="mt-4 space-y-6">
          <UserProfileBioLine user={user} />
          <UserProfileActionRow
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            followPending={toggleFollowMutation.isPending}
            onFollowToggle={() =>
              toggleFollowMutation.mutate({
                params: { path: { userId } },
              })
            }
          />
          <UserProfileStatsGrid
            visitCount={user.visitCount}
            sendCount={user.sendCount}
            followerCount={user._count.followers}
            followingCount={user._count.following}
          />
        </div>

        <section className="mt-10 px-6">
          <UserProfileActivityHeading />
          <UserProfileHeatmap
            levels={user.activityHeatmap}
            dayKeys={user.activityHeatmapDays}
            selectedYmd={selectedYmd}
            onToggleYmd={onToggleYmd}
          />
          <div className="mt-4">
            <UserProfileSelectionCaption selectedYmd={selectedYmd} />
          </div>
        </section>

        <UserProfileRecordsSection userId={userId} selectedYmd={selectedYmd} />
      </main>
    </div>
  );
};

export default UserProfileMain;
