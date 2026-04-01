"use client";

import { Bell, Check, Instagram, Settings, User, Youtube } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { difficultyToKoreanMap, type Difficulty } from "@clog/utils";

import { openapi } from "#web/apis/openapi";
import AppTopBar from "#web/components/layout/AppTopBar";
import ImageLightboxDialog from "#web/components/shared/image-carousel-lightbox/ImageLightboxDialog";
import { ROUTES } from "#web/constants";
import { formatProfileCount } from "#web/libs/format/formatProfileCount";

import FollowListSheet from "./FollowListSheet";

const ProfileSummarySection = () => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  const [followSheet, setFollowSheet] = useState<
    "followers" | "following" | null
  >(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const follower = me._count?.followers ?? 0;
  const following = me._count?.following ?? 0;

  return (
    <div className="w-full">
      {/* 헤더 */}
      <AppTopBar
        left={
          <span className="text-lg font-bold text-on-surface">내 정보</span>
        }
        right={
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.MY.SETTINGS.path}
              className="text-primary transition-opacity hover:opacity-80 active:scale-95"
              aria-label="설정"
            >
              <Settings className="size-6" strokeWidth={1.75} />
            </Link>
            <Link
              href={ROUTES.NOTIFICATIONS.path}
              className="text-primary transition-opacity hover:opacity-80 active:scale-95"
              aria-label="알림"
            >
              <Bell className="size-6" strokeWidth={1.75} />
            </Link>
          </div>
        }
      />

      {/* 커버 이미지 (프로필과 겹치는 영역은 아래 프로필 섹션 z-20이 클릭을 가져감) */}
      <section className="relative z-0 h-56 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary-container/50 via-primary/35 to-secondary-container/45 opacity-90" />
        {me.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={me.coverImage}
              alt=""
              className="absolute inset-0 size-full object-cover mix-blend-overlay"
            />
            <button
              type="button"
              aria-label="커버 이미지 크게 보기"
              className="absolute inset-0 z-10 cursor-zoom-in"
              onClick={() => setLightboxUrl(me.coverImage)}
            />
          </>
        ) : null}
      </section>

      {/* 프로필 영역 */}
      <section className="relative z-20 -mt-16 flex flex-col items-center px-6">
        {/* 아바타 */}
        <div className="relative">
          {me.profileImage ? (
            <button
              type="button"
              aria-label="프로필 이미지 크게 보기"
              className="size-32 cursor-zoom-in overflow-hidden rounded-full border-4 border-background bg-surface-container-highest shadow-xl ring-1 ring-outline-variant/20"
              onClick={() => setLightboxUrl(me.profileImage)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={me.profileImage}
                alt=""
                className="size-full object-cover"
              />
            </button>
          ) : (
            <div className="size-32 overflow-hidden rounded-full border-4 border-background bg-surface-container-highest shadow-xl ring-1 ring-outline-variant/20">
              <div className="flex size-full items-center justify-center">
                <User className="size-12 text-on-surface-variant" />
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full border-4 border-background bg-secondary">
            <Check className="text-on-secondary size-4" strokeWidth={3} />
          </div>
        </div>

        {/* 닉네임 / 소개 */}
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            {me.nickname}
          </h1>
          <p className="mt-1 font-medium tracking-wide text-primary">
            @{me.nickname}
          </p>
          {me.bio ? (
            <p className="mt-3 max-w-xs text-sm leading-relaxed break-keep text-on-surface-variant">
              {me.bio}
            </p>
          ) : null}
          {me.maxDifficulty ? (
            <p className="mt-2 text-xs text-on-surface-variant">
              최고 난이도{" "}
              <span className="font-semibold text-tertiary">
                {difficultyToKoreanMap[me.maxDifficulty as Difficulty]}
              </span>
            </p>
          ) : null}

          {/* 인스타그램 / 유튜브 */}
          {(me.instagramId || me.youtubeUrl) && (
            <div className="mt-3 flex items-center justify-center gap-3">
              {me.instagramId && (
                <a
                  href={`https://instagram.com/${me.instagramId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-on-surface-variant transition-colors hover:text-primary"
                >
                  <Instagram className="size-4" strokeWidth={1.75} />
                  <span>@{me.instagramId}</span>
                </a>
              )}
              {me.youtubeUrl && (
                <a
                  href={me.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-on-surface-variant transition-colors hover:text-destructive"
                >
                  <Youtube className="size-4" strokeWidth={1.75} />
                  <span>YouTube</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* 통계 카드 */}
        <div className="mt-8 grid w-full max-w-md grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded-2xl border border-outline-variant/10 bg-surface-container-low py-3">
            <span className="text-xl leading-none font-bold text-primary">
              {formatProfileCount(me.visitCount)}
            </span>
            <span className="mt-1.5 text-xs font-bold tracking-wider text-outline uppercase">
              방문
            </span>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-outline-variant/10 bg-surface-container-low py-3">
            <span className="text-xl leading-none font-bold text-secondary">
              {formatProfileCount(me.sendCount)}
            </span>
            <span className="mt-1.5 text-xs font-bold tracking-wider text-outline uppercase">
              완등
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFollowSheet("followers")}
            className="flex flex-col items-center rounded-2xl border border-outline-variant/10 bg-surface-container-low py-3 transition-colors hover:bg-surface-container active:scale-95"
          >
            <span className="text-xl leading-none font-bold text-on-surface">
              {formatProfileCount(follower)}
            </span>
            <span className="mt-1.5 text-xs font-bold tracking-wider text-outline uppercase">
              팔로워
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFollowSheet("following")}
            className="flex flex-col items-center rounded-2xl border border-outline-variant/10 bg-surface-container-low py-3 transition-colors hover:bg-surface-container active:scale-95"
          >
            <span className="text-xl leading-none font-bold text-on-surface">
              {formatProfileCount(following)}
            </span>
            <span className="mt-1.5 text-xs font-bold tracking-wider text-outline uppercase">
              팔로잉
            </span>
          </button>
        </div>

        {/* 프로필 편집 버튼 */}
        <Link
          href={ROUTES.MY.PROFILE_EDIT.path}
          className="mt-8 flex w-full max-w-sm items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low py-3.5 text-base font-semibold text-on-surface transition-all hover:bg-surface-container active:scale-95"
        >
          프로필 편집
        </Link>
      </section>

      <FollowListSheet
        userId={me.id}
        type={followSheet}
        onClose={() => setFollowSheet(null)}
      />

      <ImageLightboxDialog
        url={lightboxUrl}
        open={lightboxUrl !== null}
        onOpenChange={(o) => {
          if (!o) setLightboxUrl(null);
        }}
        altPrefix="프로필"
      />
    </div>
  );
};

export default ProfileSummarySection;
