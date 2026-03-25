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
      <div className="px-6">
        <Link
          href={ROUTES.MY.SETTINGS.path}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-b from-primary to-primary-container font-bold text-on-primary shadow-lg transition-transform active:scale-95"
        >
          프로필 편집
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6">
      <FollowButton
        isFollowing={isFollowing}
        isLoading={followPending}
        onClick={onFollowToggle}
        className={cn(
          "h-12 w-full rounded-xl font-bold",
          isFollowing
            ? "border border-outline-variant bg-transparent text-primary shadow-none"
            : "border-0 bg-gradient-to-b from-primary to-primary-container text-on-primary shadow-lg",
        )}
      />
    </div>
  );
};

export default UserProfileActionRow;
