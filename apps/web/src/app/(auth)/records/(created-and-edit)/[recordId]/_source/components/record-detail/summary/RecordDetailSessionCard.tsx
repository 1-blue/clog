"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import type { IExerciseTimeSummary } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

type RecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  record: RecordDetail;
  exercise: IExerciseTimeSummary | null;
  className?: string;
}

const RecordDetailSessionCard = ({ record, exercise, className }: IProps) => {
  const created = new Date(record.createdAt);
  const updated = new Date(record.updatedAt);
  const showUpdated =
    record.updatedAt !== record.createdAt &&
    Math.abs(updated.getTime() - created.getTime()) > 60_000;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface-container-low p-5 shadow-2xl",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
            record.isPublic
              ? "bg-primary/15 text-primary"
              : "bg-surface-container-high text-on-surface-variant",
          )}
        >
          {record.isPublic ? "공개" : "비공개"}
        </span>
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">
          세션 완료
        </span>
      </div>

      <div className="flex gap-3">
        {record.gym.logoImageUrl ? (
          <div className="shrink-0">
            <img
              src={record.gym.logoImageUrl}
              alt=""
              className="size-12 rounded-sm object-contain sm:size-14"
            />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Link
            href={ROUTES.GYMS.DETAIL.path(record.gym.id)}
            className="block text-2xl font-bold tracking-tight text-on-surface hover:underline"
          >
            {record.gym.name}
          </Link>
          <p className="text-xs leading-snug text-on-surface-variant">
            {record.gym.address}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays
            className="size-4 shrink-0 text-primary"
            strokeWidth={2}
          />
          {format(new Date(record.date), "yyyy.MM.dd", { locale: ko })}
        </span>
        {exercise ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 shrink-0 text-primary" strokeWidth={2} />
            <span>{exercise.rangeLabel}</span>
          </span>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-on-surface-variant/90">
        작성 {format(created, "yyyy.MM.dd HH:mm", { locale: ko })}
        {showUpdated ? (
          <> · 수정 {format(updated, "yyyy.MM.dd HH:mm", { locale: ko })}</>
        ) : null}
      </p>
    </div>
  );
};

export default RecordDetailSessionCard;
