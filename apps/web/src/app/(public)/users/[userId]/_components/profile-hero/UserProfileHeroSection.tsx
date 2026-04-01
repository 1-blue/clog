"use client";

import { UserRound } from "lucide-react";
import { useState } from "react";

import { difficultyToKoreanMap, type Difficulty } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import ImageLightboxDialog from "#web/components/shared/image-carousel-lightbox/ImageLightboxDialog";

type TUserProfile = components["schemas"]["UserProfile"];

interface IProps {
  user: TUserProfile;
}

const UserProfileHeroSection: React.FC<IProps> = ({ user }) => {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  return (
    <section className="relative">
      <div className="relative z-0 h-48 w-full overflow-hidden bg-surface-container-low">
        {user.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.coverImage}
              alt=""
              className="size-full object-cover"
            />
            <button
              type="button"
              aria-label="커버 이미지 크게 보기"
              className="absolute inset-0 z-10 cursor-zoom-in"
              onClick={() => setLightboxUrl(user.coverImage)}
            />
          </>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/35 to-surface-container-low" />
      </div>

      <div className="relative z-20 -mt-20 flex flex-col items-center px-6">
        <div className="relative">
          {user.profileImage ? (
            <button
              type="button"
              aria-label="프로필 이미지 크게 보기"
              className="size-32 cursor-zoom-in overflow-hidden rounded-xl border-4 border-surface bg-surface-container-highest shadow-2xl"
              onClick={() => setLightboxUrl(user.profileImage)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.profileImage}
                alt=""
                className="size-full object-cover"
              />
            </button>
          ) : (
            <div className="size-32 overflow-hidden rounded-xl border-4 border-surface bg-surface-container-highest shadow-2xl">
              <div className="flex size-full items-center justify-center bg-surface-container-high">
                <UserRound
                  className="size-14 text-on-surface-variant"
                  strokeWidth={1.25}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            {user.nickname}
          </h2>
          {user.maxDifficulty ? (
            <p className="mt-2 text-sm text-on-surface-variant">
              최고 난이도{" "}
              <span className="font-semibold text-tertiary">
                {difficultyToKoreanMap[user.maxDifficulty as Difficulty]}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <ImageLightboxDialog
        url={lightboxUrl}
        open={lightboxUrl !== null}
        onOpenChange={(o) => {
          if (!o) setLightboxUrl(null);
        }}
        altPrefix="프로필"
      />
    </section>
  );
};

export default UserProfileHeroSection;
