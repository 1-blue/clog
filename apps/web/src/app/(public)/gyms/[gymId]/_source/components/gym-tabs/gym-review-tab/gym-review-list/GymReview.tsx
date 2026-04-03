"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Star, User } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

import {
  gymReviewFeatureToKoreanMap,
  perceivedDifficultyToKoreanMap,
} from "@clog/utils";

import type { components } from "#web/@types/openapi";
import ImageStripLightbox from "#web/components/shared/ImageStripLightbox";
import { Badge, type TBadgeColor } from "#web/components/ui/badge";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

type TReviewListItem = components["schemas"]["ReviewListItem"];
type TGymPerceivedDifficulty = components["schemas"]["GymPerceivedDifficulty"];

const difficultyBadgeProps = (
  d: TGymPerceivedDifficulty,
): { variant: "outline"; color: TBadgeColor } => {
  switch (d) {
    case "EASY":
      return { variant: "outline", color: "secondary" };
    case "EASY_NORMAL":
      return { variant: "outline", color: "primaryContainer" };
    case "NORMAL":
      return { variant: "outline", color: "tertiary" };
    case "NORMAL_HARD":
      return { variant: "outline", color: "primary" };
    case "HARD":
      return { variant: "outline", color: "danger" };
    default:
      return { variant: "outline", color: "tertiary" };
  }
};

interface IProps {
  review: TReviewListItem;
}

const formatReviewDateTime = (iso: string) =>
  format(new Date(iso), "yyyy.MM.dd", { locale: ko });

const GymReview: React.FC<IProps> = ({ review }) => {
  const [contentExpanded, setContentExpanded] = useState(false);
  const reviewImageUrls = useMemo(() => review.imageUrls, [review.imageUrls]);

  const createdLabel = formatReviewDateTime(review.createdAt);
  const updatedLabel = formatReviewDateTime(review.updatedAt);
  const isEdited =
    new Date(review.updatedAt).getTime() -
      new Date(review.createdAt).getTime() >
    2000;

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface-container-low p-3">
      <div className="flex min-h-9 items-stretch gap-2">
        <Link
          href={ROUTES.USERS.PROFILE.path(review.user.id)}
          aria-label={`${review.user.nickname} 프로필로 이동`}
          className="flex min-h-0 min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
        >
          <div className="size-7 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
            {review.user.profileImage ? (
              <img
                src={review.user.profileImage}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <User
                  className="size-3.5 text-on-surface-variant"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            )}
          </div>
          <span className="min-w-0 truncate text-sm font-medium text-on-surface">
            {review.user.nickname}
          </span>
        </Link>
        <div className="ml-auto flex shrink-0 flex-col items-end gap-1 self-center">
          <p className="text-[11px] leading-tight text-on-surface-variant/85">
            {isEdited ? (
              <>
                <span className="text-on-surface-variant/70">수정일</span>{" "}
                <span className="tabular-nums">{updatedLabel}</span>
              </>
            ) : (
              <>
                <span className="text-on-surface-variant/70">작성일</span>{" "}
                <span className="tabular-nums">{createdLabel}</span>
              </>
            )}
          </p>
          <div
            className="flex items-center gap-0.5"
            aria-label={`평점 ${review.rating}점`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < review.rating
                    ? "fill-tertiary text-tertiary"
                    : "fill-none text-on-surface-variant/35",
                )}
                strokeWidth={2}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      <ImageStripLightbox
        urls={reviewImageUrls}
        altPrefix={`${review.user.nickname} 리뷰 이미지`}
      />

      <button
        type="button"
        onClick={() => setContentExpanded((prev) => !prev)}
        aria-expanded={contentExpanded}
        aria-label={contentExpanded ? "리뷰 본문 접기" : "리뷰 본문 펼치기"}
        className={cn(
          "font-inherit w-full cursor-pointer border-0 bg-transparent p-0 text-left text-sm whitespace-pre-wrap text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:outline-none",
          !contentExpanded && "line-clamp-4",
        )}
      >
        {review.content}
      </button>

      {(review.features.length > 0 || review.perceivedDifficulty) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {review.perceivedDifficulty ? (
            <Badge
              {...difficultyBadgeProps(review.perceivedDifficulty)}
              className="h-auto min-h-5 rounded-full px-2 py-0.5 text-xs font-medium"
            >
              난이도{" "}
              {perceivedDifficultyToKoreanMap[review.perceivedDifficulty]}
            </Badge>
          ) : null}

          {review.features.map((feature) => {
            return (
              <span
                key={feature}
                className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant"
              >
                {gymReviewFeatureToKoreanMap[feature]}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GymReview;
