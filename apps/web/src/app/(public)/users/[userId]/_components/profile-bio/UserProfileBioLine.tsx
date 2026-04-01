"use client";

import { Instagram, Youtube } from "lucide-react";

import type { components } from "#web/@types/openapi";

type TUserProfile = components["schemas"]["UserProfile"];

interface IProps {
  user: TUserProfile;
}

const UserProfileBioLine: React.FC<IProps> = ({ user }) => {
  const hasInstagram = !!user.instagramId;
  const hasYoutube = !!user.youtubeUrl;
  const hasSocial = hasInstagram || hasYoutube;

  if (!user.bio && !hasSocial) {
    return null;
  }

  return (
    <div>
      {user.bio ? (
        <p className="rounded-sm bg-primary/20 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-on-surface-variant">
          {user.bio}
        </p>
      ) : null}
      {hasSocial ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {hasInstagram ? (
            <a
              href={`https://instagram.com/${user.instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-primary"
              aria-label={`Instagram @${user.instagramId}`}
            >
              <Instagram className="size-4 shrink-0" strokeWidth={1.5} />
              <span>@{user.instagramId}</span>
            </a>
          ) : null}
          {hasYoutube ? (
            <a
              href={user.youtubeUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-primary"
              aria-label="YouTube 채널"
            >
              <Youtube className="size-4 shrink-0" strokeWidth={1.5} />
              <span>YouTube</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default UserProfileBioLine;
