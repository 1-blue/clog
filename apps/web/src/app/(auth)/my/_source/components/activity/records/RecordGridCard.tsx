"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckCircle2, Clock, Mountain } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import type { Difficulty } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import { getDifficultyChipPresentation } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { getExerciseTimeSummary } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

type TRecord = components["schemas"]["RecordListItem"];

interface IProps {
  record: TRecord;
  className?: string;
}

/** RecordDayCard와 동일 — 암장 매핑 없을 때 점 색 */
const FALLBACK_DIFFICULTY_HEX: Record<string, string> = {
  V0: "#E5E7EB",
  V1: "#F5DC4C",
  V2: "#F0A830",
  V3: "#5ABF72",
  V4: "#3A9EE0",
  V5: "#E05555",
  V6: "#A040C0",
  V7: "#8B5E3C",
  V8: "#888888",
  V9: "#111111",
  V10: "#111111",
};

const RecordGridCard = ({ record, className }: IProps) => {
  const exercise = getExerciseTimeSummary(record.startTime, record.endTime);
  const dateLabel = format(new Date(record.date), "yyyy.MM.dd", { locale: ko });

  const diffGroups = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const r of record.routes) {
      acc[r.difficulty] = (acc[r.difficulty] ?? 0) + 1;
    }
    return Object.entries(acc);
  }, [record.routes]);

  const sendCount = useMemo(
    () =>
      record.routes.filter((r) =>
        ["SEND", "FLASH", "ONSIGHT"].includes(r.result),
      ).length,
    [record.routes],
  );
  const totalRoutes = record.routes.length;

  const heroImage =
    record.imageUrls[0] ?? record.gym.logoImageUrl ?? undefined;

  const difficultyDotColor = useMemo(() => {
    const colors = record.gym.difficultyColors;

    return (difficulty: string) => {
      const p = getDifficultyChipPresentation(difficulty as Difficulty, colors);
      if (p.kind === "gym") return p.backgroundColor;
      return FALLBACK_DIFFICULTY_HEX[difficulty] ?? "#999999";
    };
  }, [record.gym.difficultyColors]);

  return (
    <Link
      href={ROUTES.RECORDS.DETAIL.path(record.id)}
      className={cn(
        "mx-auto block w-full max-w-[480px] overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/10 transition-transform active:scale-[0.98]",
        className,
      )}
    >
      {/* 2:1 비율, 높이 상한 220px — 이미지는 object-cover로 크롭 */}
      <div className="relative aspect-2/1 max-h-[220px] w-full overflow-hidden bg-surface-container-high">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <Mountain
              className="size-14 text-on-surface-variant/40"
              strokeWidth={1.25}
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow">
            {record.gym.name}
          </p>
          <p className="mt-0.5 text-xs font-medium text-white/90 drop-shadow">
            {dateLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-3 py-2.5">
        {exercise && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Clock className="size-3 shrink-0" strokeWidth={2} />
              {exercise.rangeLabel}
            </span>
            <span className="text-on-surface-variant/90">
              {exercise.totalLabel}
            </span>
          </div>
        )}

        {totalRoutes > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
            <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
            <span>
              완등 {sendCount}/{totalRoutes}
            </span>
          </div>
        )}

        {diffGroups.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {diffGroups.map(([difficulty, count]) => (
              <span
                key={difficulty}
                className="flex items-center gap-0.5 rounded-full bg-surface-container px-1.5 py-1 text-[10px] font-medium text-on-surface"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: difficultyDotColor(difficulty),
                  }}
                />
                {difficulty} x{count}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecordGridCard;
