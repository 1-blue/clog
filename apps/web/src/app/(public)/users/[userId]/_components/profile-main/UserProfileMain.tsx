"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import FollowListSheet from "#web/app/(auth)/my/_source/components/FollowListSheet";
import AppTopBar from "#web/components/layout/AppTopBar";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";

import UserProfileActionRow from "../profile-actions/UserProfileActionRow";
import UserProfileActivityHeading from "../profile-activity/UserProfileActivityHeading";
import UserProfileBioLine from "../profile-bio/UserProfileBioLine";
import UserProfileHeatmap from "../profile-heatmap/UserProfileHeatmap";
import UserProfileHeroSection from "../profile-hero/UserProfileHeroSection";
import UserProfileRecordsSection from "../profile-records/UserProfileRecordsSection";
import UserProfileSelectionCaption from "../profile-activity/UserProfileSelectionCaption";
import UserProfileStatsGrid from "../profile-stats/UserProfileStatsGrid";

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
  const [followSheet, setFollowSheet] = useState<
    "followers" | "following" | null
  >(null);

  const onToggleYmd = useCallback((ymd: string) => {
    setSelectedYmd((prev) => (prev === ymd ? null : ymd));
  }, []);

  const shareProfile = async () => {
    try {
      const url =
        typeof window !== "undefined" ? window.location.href : "";
      if (navigator.share) {
        await navigator.share({
          title: `${user.nickname} · 프로필`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.message("프로필 링크를 복사했어요");
      }
    } catch {
      /* 사용자 취소 등 */
    }
  };

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
            <span className="text-lg font-semibold text-on-surface">
              프로필
            </span>
          </div>
        }
        right={
          <button
            type="button"
            onClick={() => void shareProfile()}
            className="flex size-9 items-center justify-center rounded-full text-primary hover:bg-surface-container-high"
            aria-label="공유"
          >
            <Share2 className="size-5" strokeWidth={2} />
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
            onFollowersClick={() => setFollowSheet("followers")}
            onFollowingClick={() => setFollowSheet("following")}
          />
        </div>

        <section className="mt-10">
          <UserProfileActivityHeading />
          <UserProfileHeatmap
            levels={user.activityHeatmap}
            dayKeys={user.activityHeatmapDays}
            selectedYmd={selectedYmd}
            onToggleYmd={onToggleYmd}
            sessionCountInRange={user.activityHeatmapSessionCount}
          />
          <div className="mt-4">
            <UserProfileSelectionCaption selectedYmd={selectedYmd} />
          </div>
        </section>

        <UserProfileRecordsSection userId={userId} selectedYmd={selectedYmd} />
      </main>

      <FollowListSheet
        userId={userId}
        type={followSheet}
        onClose={() => setFollowSheet(null)}
      />
    </div>
  );
};

export default UserProfileMain;
