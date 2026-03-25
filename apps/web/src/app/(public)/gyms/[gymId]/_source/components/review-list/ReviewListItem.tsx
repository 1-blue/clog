"use client";

import { Star, User } from "lucide-react";
import { useMemo, useState } from "react";

import {
  gymReviewFeatureToKoreanMap,
  type GymReviewFeature,
} from "@clog/utils";

import type { components } from "#web/@types/openapi";
import ImageStripLightbox from "#web/components/shared/ImageStripLightbox";
import { cn } from "#web/libs/utils";

type TReviewListItem = components["schemas"]["ReviewListItem"];

interface IProps {
  review: TReviewListItem;
}

const ReviewListItem: React.FC<IProps> = ({ review }) => {
  const [contentExpanded, setContentExpanded] = useState(false);
  const reviewImageUrls = useMemo(
    () =>
      [...review.images]
        .sort((a, b) => a.order - b.order)
        .map((img) => img.url),
    [review.images],
  );

  return (
    <div className="rounded-2xl bg-surface-container-low p-3">
      <div className="flex items-center gap-2">
        <div className="size-7 overflow-hidden rounded-full bg-surface-container-high">
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
        <span className="text-sm font-medium text-on-surface">
          {review.user.nickname}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-tertiary text-tertiary"
              strokeWidth={2}
              aria-hidden
            />
          ))}
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
          "font-inherit mt-1.5 w-full cursor-pointer border-0 bg-transparent p-0 text-left text-sm whitespace-pre-wrap text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:outline-none",
          !contentExpanded && "line-clamp-4",
        )}
      >
        {review.content}
      </button>

      {review.features.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {review.features.map((f) => {
            const key = f as GymReviewFeature;
            return (
              <span
                key={key}
                className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant"
              >
                {gymReviewFeatureToKoreanMap[key]}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewListItem;
