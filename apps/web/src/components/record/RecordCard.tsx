import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React from "react";
import Link from "next/link";

import {
  attemptResultToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/contracts";

import { ROUTES } from "#web/constants";

import DifficultyChip from "./DifficultyChip";

interface IRouteInfo {
  difficulty: Difficulty;
  result: AttemptResult;
}

interface IProps {
  id: string;
  date: string | Date;
  gymName: string;
  routes: IRouteInfo[];
  imageUrl?: string | null;
}

const RecordCard: React.FC<IProps> = ({
  id,
  date,
  gymName,
  routes,
  imageUrl,
}) => {
  const sends = routes.filter((r) => r.result !== "ATTEMPT").length;

  return (
    <Link
      href={ROUTES.RECORDS.DETAIL.path(id)}
      className="block rounded-2xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container"
    >
      <div className="flex items-start gap-3">
        {imageUrl && (
          <div className="size-16 shrink-0 overflow-hidden rounded-xl">
            <img src={imageUrl} alt="" className="size-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs text-on-surface-variant">
            {format(new Date(date), "M월 d일 (EEE)", { locale: ko })}
          </p>
          <h3 className="mt-0.5 font-semibold text-on-surface">{gymName}</h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            {routes.length}개 루트 · {sends}개 완등
          </p>
        </div>
      </div>

      {/* 루트 난이도 칩 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {routes.map((route, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <DifficultyChip difficulty={route.difficulty} />
            <span className="text-[10px] text-on-surface-variant">
              {attemptResultToKoreanMap[route.result]}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
};
export default RecordCard;
