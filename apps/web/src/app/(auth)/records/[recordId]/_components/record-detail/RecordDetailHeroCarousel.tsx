"use client";

import { Mountain } from "lucide-react";

import { cn } from "#web/libs/utils";

interface IProps {
  imageUrls: string[];
  className?: string;
}

const RecordDetailHeroCarousel = ({ imageUrls, className }: IProps) => (
  <div
    className={cn(
      "relative w-full overflow-hidden bg-surface-container-high",
      className,
    )}
  >
    {imageUrls.length > 0 ? (
      <div className="scrollbar-hide flex aspect-3/4 max-h-screen w-full snap-x snap-mandatory overflow-x-auto md:aspect-video">
        {imageUrls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative w-full shrink-0 snap-center"
          >
            <img
              src={url}
              alt=""
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          </div>
        ))}
      </div>
    ) : (
      <div className="flex aspect-3/4 max-h-96 items-center justify-center md:aspect-video">
        <Mountain
          className="size-20 text-on-surface-variant/40"
          strokeWidth={1.25}
        />
      </div>
    )}
  </div>
);

export default RecordDetailHeroCarousel;
