"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";

import ImageCarouselLightboxDialog from "#web/components/shared/image-carousel-lightbox/ImageCarouselLightboxDialog";
import { cn } from "#web/libs/utils";

const S3_BASE =
  "https://climbing-log.s3.ap-northeast-2.amazonaws.com/default/about";

const heroImages = [
  { src: `${S3_BASE}/home.jpeg`, alt: "홈 화면" },
  { src: `${S3_BASE}/gym.jpeg`, alt: "암장 목록" },
  { src: `${S3_BASE}/record.jpeg`, alt: "클라이밍 기록" },
];

const midImages = [
  { src: `${S3_BASE}/statistics.jpeg`, alt: "통계 대시보드" },
  { src: `${S3_BASE}/memberships.jpeg`, alt: "회원권 관리" },
  { src: `${S3_BASE}/community.jpeg`, alt: "커뮤니티" },
];

interface IProps {
  variant: "hero" | "mid";
}

const LandingVisualPlaceholder: React.FC<IProps> = ({ variant }) => {
  const images = variant === "hero" ? heroImages : midImages;
  const urls = images.map((img) => img.src);

  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openAt = useCallback(
    (index: number) => {
      setStartIndex(Math.min(Math.max(0, index), urls.length - 1));
      setOpen(true);
    },
    [urls.length],
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={variant === "hero" ? "mt-10 sm:mt-14" : "my-16 sm:my-20"}
      >
        <div
          className={cn(
            "grid gap-3 sm:gap-4",
            variant === "hero"
              ? "grid-cols-3"
              : "grid-cols-3",
          )}
        >
          {images.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => openAt(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-high shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
              aria-label={`${img.alt} 전체 보기`}
            >
              <div className="relative aspect-9/16 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading={variant === "hero" && i === 0 ? "eager" : "lazy"}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <p className="px-2 py-2.5 text-center text-xs font-medium text-on-surface-variant sm:text-sm">
                {img.alt}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <ImageCarouselLightboxDialog
        urls={urls}
        open={open}
        onOpenChange={setOpen}
        initialIndex={startIndex}
        altPrefix={variant === "hero" ? "앱 화면" : "기능 소개"}
      />
    </>
  );
};

export default LandingVisualPlaceholder;
