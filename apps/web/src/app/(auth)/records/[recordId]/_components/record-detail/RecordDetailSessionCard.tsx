"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import type { IExerciseTimeSummary } from "./record-detail-utils";

type RecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  record: RecordDetail;
  exercise: IExerciseTimeSummary | null;
  className?: string;
}

const RecordDetailSessionCard = ({
  record,
  exercise,
  className,
}: IProps) => (
  <div
    className={cn(
      "rounded-2xl border border-white/10 bg-surface-container-low p-5 shadow-2xl",
      className,
    )}
  >
    <p className="text-xs font-bold tracking-widest text-secondary uppercase">
      세션 완료
    </p>
    <Link
      href={ROUTES.GYMS.DETAIL.path(record.gym.id)}
      className="mt-1 block text-2xl font-bold tracking-tight text-on-surface hover:underline"
    >
      {record.gym.name}
    </Link>
    <p className="mt-0.5 text-xs leading-snug text-on-surface-variant">
      {record.gym.address}
    </p>

    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-on-surface-variant">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-4 shrink-0 text-primary" strokeWidth={2} />
        {format(new Date(record.date), "yyyy.MM.dd", { locale: ko })}
      </span>
      {exercise && (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 shrink-0 text-primary" strokeWidth={2} />
            <span>{exercise.rangeLabel}</span>
          </span>
          <span className="text-xs text-on-surface-variant">
            {exercise.totalLabel}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default RecordDetailSessionCard;
