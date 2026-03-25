"use client";

import { Instagram, Youtube } from "lucide-react";

import { difficultyToKoreanMap, type Difficulty } from "@clog/utils";

import type { components } from "#web/@types/openapi";

type TUserProfile = components["schemas"]["UserProfile"];

interface IProps {
  user: TUserProfile;
}

const UserProfileBioLine: React.FC<IProps> = ({ user }) => {
  const subtitle =
    user.maxDifficulty != null
      ? `@${user.nickname} · ${difficultyToKoreanMap[user.maxDifficulty as Difficulty]} 프로젝트`
      : `@${user.nickname}`;

  const hasInstagram = !!user.instagramId;
  const hasYoutube = !!user.youtubeUrl;
  const hasSocial = hasInstagram || hasYoutube;

  return (
    <div className="px-6 text-center">
      <p className="text-sm text-on-surface-variant">{subtitle}</p>
      {user.bio ? (
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          {user.bio}
        </p>
      ) : null}
      {hasSocial ? (
        <div className="mt-3 flex items-center justify-center gap-4">
          {hasInstagram ? (
            <a
              href={`https://instagram.com/${user.instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-primary"
              aria-label={`Instagram @${user.instagramId}`}
            >
              <Instagram className="size-4" strokeWidth={1.5} />
              <span>@{user.instagramId}</span>
            </a>
          ) : null}
          {hasYoutube ? (
            <a
              href={user.youtubeUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-primary"
              aria-label="YouTube 채널"
            >
              <Youtube className="size-4" strokeWidth={1.5} />
              <span>YouTube</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default UserProfileBioLine;
