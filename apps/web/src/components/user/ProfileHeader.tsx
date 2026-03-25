import React from "react";

import type { Difficulty } from "@clog/utils";

import DifficultyChip from "#web/components/record/DifficultyChip";
import { Avatar, AvatarFallback, AvatarImage } from "#web/components/ui/avatar";

interface IProps {
  nickname: string;
  bio?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  maxDifficulty?: Difficulty | null;
  followingCount: number;
  followersCount: number;
  sessionsCount: number;
  action?: React.ReactNode;
}

const ProfileHeader: React.FC<IProps> = ({
  nickname,
  bio,
  profileImage,
  coverImage,
  maxDifficulty,
  followingCount,
  followersCount,
  sessionsCount,
  action,
}) => {
  return (
    <div>
      {/* 커버 */}
      <div className="h-32 bg-surface-container-high">
        {coverImage && (
          <img src={coverImage} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="px-4">
        {/* 아바타 */}
        <div className="-mt-12 flex items-end justify-between">
          <Avatar className="size-24 border-4 border-surface">
            <AvatarImage src={profileImage ?? undefined} alt={nickname} />
            <AvatarFallback className="bg-primary-container text-2xl text-on-primary-container">
              {nickname[0]}
            </AvatarFallback>
          </Avatar>
          {action}
        </div>

        {/* 이름 + 최고 난이도 */}
        <div className="mt-2 flex items-center gap-2">
          <h2 className="text-xl font-bold text-on-surface">{nickname}</h2>
          {maxDifficulty && (
            <DifficultyChip difficulty={maxDifficulty} size="md" />
          )}
        </div>

        {bio && <p className="mt-1 text-sm text-on-surface-variant">{bio}</p>}

        {/* 통계 */}
        <div className="mt-3 flex gap-5">
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">{sessionsCount}</p>
            <p className="text-xs text-on-surface-variant">기록</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">
              {followersCount}
            </p>
            <p className="text-xs text-on-surface-variant">팔로워</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">
              {followingCount}
            </p>
            <p className="text-xs text-on-surface-variant">팔로잉</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
