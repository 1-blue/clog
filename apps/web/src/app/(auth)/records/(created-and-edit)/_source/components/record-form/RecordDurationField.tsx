"use client";

import { Clock } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  normalizeSessionTimeRange,
  SESSION_HOUR_OPTIONS,
  SESSION_MAX_MINUTES,
  SESSION_MIN_MINUTES,
  SESSION_MINUTE_OPTIONS,
} from "@clog/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#web/components/ui/select";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  className?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const splitHM = (total: number) => {
  const t = clamp(total, SESSION_MIN_MINUTES, SESSION_MAX_MINUTES);
  return { h: Math.floor(t / 60), m: t % 60 };
};

const snapMinuteToStep = (m: number) =>
  SESSION_MINUTE_OPTIONS.reduce((best, opt) =>
    Math.abs(opt - m) < Math.abs(best - m) ? opt : best,
  );

const formatTimeKo = (total: number) => {
  const { h, m } = splitHM(total);
  if (m === 0) return `${h}시`;
  return `${h}시 ${m}분`;
};

const formatGapKo = (start: number, end: number) => {
  const d = end - start;
  if (d <= 0) return "";
  const h = Math.floor(d / 60);
  const m = d % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

interface ITimePairProps {
  totalMinutes: number;
  onPick: (nextTotal: number) => void;
}

const TimePair = ({ totalMinutes, onPick }: ITimePairProps) => {
  const { h, m } = splitHM(totalMinutes);
  const minuteValue = snapMinuteToStep(m);

  const apply = (nextH: number, nextM: number) => {
    onPick(clamp(nextH * 60 + nextM, SESSION_MIN_MINUTES, SESSION_MAX_MINUTES));
  };

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
      <Select
        value={String(h)}
        onValueChange={(v) => apply(Number(v), minuteValue)}
      >
        <SelectTrigger className="h-11 min-w-18 flex-1! rounded-xl border-outline-variant/40 bg-surface-container text-on-surface sm:min-w-20 sm:flex-none">
          <SelectValue placeholder="시" />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-xl border-outline-variant bg-popover">
          {SESSION_HOUR_OPTIONS.map((hour) => (
            <SelectItem key={hour} value={String(hour)}>
              {hour}시
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(minuteValue)}
        onValueChange={(v) => apply(h, Number(v))}
      >
        <SelectTrigger className="h-11 min-w-18 flex-1! rounded-xl border-outline-variant/40 bg-surface-container text-on-surface sm:min-w-20 sm:flex-none">
          <SelectValue placeholder="분" />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-xl border-outline-variant bg-popover">
          {SESSION_MINUTE_OPTIONS.map((min) => (
            <SelectItem key={min} value={String(min)}>
              {min}분
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const RecordDurationField = ({ className }: IProps) => {
  const { control, setValue } = useFormContext<TRecordFormData>();
  const startMinutes = useWatch({ control, name: "startMinutes" });
  const endMinutes = useWatch({ control, name: "endMinutes" });

  const setStart = (next: number) => {
    const normalized = normalizeSessionTimeRange(next, endMinutes);
    setValue("startMinutes", normalized.startMinutes);
    setValue("endMinutes", normalized.endMinutes);
  };

  const setEnd = (next: number) => {
    const normalized = normalizeSessionTimeRange(startMinutes, next);
    setValue("startMinutes", normalized.startMinutes);
    setValue("endMinutes", normalized.endMinutes);
  };

  const gap = formatGapKo(startMinutes, endMinutes);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className={recordFormFieldLabelClass}>운동 시간</span>
      <div className="rounded-2xl bg-surface-container-high px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
            <Clock className="size-5 text-secondary" strokeWidth={2} />
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-row items-center gap-4">
              <span className="shrink-0 pt-0.5 text-xs font-medium text-on-surface-variant">
                시작
              </span>
              <TimePair totalMinutes={startMinutes} onPick={setStart} />
            </div>
            <div className="flex flex-row items-center gap-4">
              <span className="shrink-0 pt-0.5 text-xs font-medium text-on-surface-variant">
                종료
              </span>
              <TimePair totalMinutes={endMinutes} onPick={setEnd} />
            </div>
          </div>
        </div>
      </div>
      <p className="gap- flex text-xs text-on-surface-variant">
        <span className="font-medium text-on-surface">
          {formatTimeKo(startMinutes)} ~ {formatTimeKo(endMinutes)}
        </span>
        <span>{gap && ` (약 ${gap})`}</span>
      </p>
    </div>
  );
};

export default RecordDurationField;
