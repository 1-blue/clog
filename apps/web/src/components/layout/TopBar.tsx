"use client";

import { ArrowLeft } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

import { cn } from "#web/libs/utils";

interface IProps {
  /** 페이지 제목 */
  title?: string;
  /** 뒤로가기 표시 여부 */
  showBack?: boolean;
  /** 오른쪽 액션 영역 */
  action?: React.ReactNode;
  /** 투명 배경 (히어로 위 오버레이) */
  transparent?: boolean;
}

const TopBar: React.FC<IProps> = ({
  title,
  showBack = false,
  action,
  transparent = false,
}) => {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 -mx-2.5 flex h-14 items-center gap-2 px-2.5",
        transparent
          ? "bg-transparent"
          : "border-b border-outline-variant bg-surface-container/80 backdrop-blur-xl",
      )}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
        >
          <ArrowLeft className="size-6" />
        </button>
      )}
      {title && (
        <h1 className="flex-1 truncate text-lg font-semibold text-on-surface">
          {title}
        </h1>
      )}
      {!title && <div className="flex-1" />}
      {action}
    </header>
  );
};
export default TopBar;
