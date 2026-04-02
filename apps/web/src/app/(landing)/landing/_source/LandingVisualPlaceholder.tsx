"use client";

import { motion } from "motion/react";

interface IProps {
  variant: "hero" | "mid";
}

/** 기획·디자인용 이미지 삽입 영역 표시 */
const LandingVisualPlaceholder: React.FC<IProps> = ({ variant }) => {
  const label =
    variant === "hero"
      ? "{ 히어로 · 앱 스크린 또는 일러스트 이미지 넣을 공간 }"
      : "{ 기능 소개용 스크린샷·대시보드 캡처 이미지 넣을 공간 }";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={
        variant === "hero"
          ? "mt-10 sm:mt-14"
          : "my-16 sm:my-20"
      }
    >
      <div
        className={
          variant === "hero"
            ? "flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container/30 px-4 py-16 text-center sm:min-h-[240px]"
            : "flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low/50 px-4 py-14 text-center"
        }
      >
        <p className="max-w-md text-xs font-medium leading-relaxed text-on-surface-variant sm:text-sm">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default LandingVisualPlaceholder;
