"use client";

import Link from "next/link";

import { buttonVariants } from "#web/components/ui/button-variants";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

const StatisticsEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-surface-container-low">
        <span className="text-4xl text-on-surface-variant" aria-hidden>
          📊
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-on-surface">아직 기록이 없어요</p>
        <p className="text-sm text-on-surface-variant">
          첫 등반을 기록하고 성장을 확인해보세요!
        </p>
      </div>
      <Link
        href={ROUTES.RECORDS.NEW.path}
        className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 py-3")}
      >
        기록 시작하기
      </Link>
    </div>
  );
};

export default StatisticsEmpty;
