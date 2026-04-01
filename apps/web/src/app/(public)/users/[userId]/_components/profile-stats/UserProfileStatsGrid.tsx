"use client";

import { formatProfileCount } from "#web/libs/format/formatProfileCount";

interface IProps {
  visitCount: number;
  sendCount: number;
  followerCount: number;
  followingCount: number;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

const UserProfileStatsGrid = ({
  visitCount,
  sendCount,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}: IProps) => {
  return (
    <section>
      <div className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline-variant/40">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="mb-1 text-xs font-medium text-on-surface-variant">
              방문
            </p>
            <p className="text-xl font-bold text-primary">
              {formatProfileCount(visitCount)}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-xs font-medium text-on-surface-variant">
              완등
            </p>
            <p className="text-xl font-bold text-secondary">
              {formatProfileCount(sendCount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onFollowersClick}
            className="text-center transition-colors hover:opacity-90 active:scale-[0.98]"
          >
            <p className="mb-1 text-xs font-medium text-on-surface-variant">
              팔로워
            </p>
            <p className="text-xl font-bold text-on-surface">
              {formatProfileCount(followerCount)}
            </p>
          </button>
          <button
            type="button"
            onClick={onFollowingClick}
            className="text-center transition-colors hover:opacity-90 active:scale-[0.98]"
          >
            <p className="mb-1 text-xs font-medium text-on-surface-variant">
              팔로잉
            </p>
            <p className="text-xl font-bold text-on-surface">
              {formatProfileCount(followingCount)}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserProfileStatsGrid;
