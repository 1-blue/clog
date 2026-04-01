"use client";

import Link from "next/link";

import FollowButton from "#web/components/user/FollowButton";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  followPending: boolean;
  onFollowToggle: () => void;
}

const UserProfileActionRow = ({
  isOwnProfile,
  isFollowing,
  followPending,
  onFollowToggle,
}: IProps) => {
  if (isOwnProfile) {
    return (
      <div>
        <Link
          href={ROUTES.MY.PROFILE_EDIT.path}
          className="flex h-12 w-full items-center justify-center rounded-xl border border-primary bg-primary/20 text-base font-semibold text-primary transition-transform hover:bg-primary/40 active:scale-[0.98]"
        >
          프로필 편집
        </Link>
      </div>
    );
  }

  return (
    <div>
      <FollowButton
        isFollowing={isFollowing}
        isLoading={followPending}
        onClick={onFollowToggle}
        className={cn(
          "h-12 w-full rounded-xl font-semibold",
          isFollowing
            ? "border border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            : "border-2 border-primary bg-primary/30 text-primary hover:bg-primary/40",
        )}
      />
    </div>
  );
};

export default UserProfileActionRow;
