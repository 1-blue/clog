"use client";

import { format, startOfMonth } from "date-fns";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type {
  CaptionLabelProps,
  ChevronProps,
  DayButtonProps,
} from "react-day-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { Calendar } from "#web/components/ui/calendar";
import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";
import { cn } from "#web/libs/utils";

import {
  CALENDAR_START,
  clampSelectedDate,
  DATE_QUERY_KEY,
  getSelectedDateFromQuery,
  toLocalDate,
} from "../../utils/records-list-date";
import RecordsCalendarBottomSheet from "./RecordsCalendarBottomSheet";

type TRecordListItem = components["schemas"]["RecordListItem"];

interface IProps {
  records: TRecordListItem[];
}

/** 네비·드롭다운용 chevron (월 좌우는 Lucide SVG) */
const RecordsCalendarChevron = ({
  className,
  orientation,
  disabled,
}: ChevronProps) => {
  const iconClass = cn(
    "size-5 shrink-0 cursor-pointer",
    disabled && "cursor-not-allowed opacity-30",
    className,
  );
  const stroke = 2;

  switch (orientation) {
    case "left":
      return (
        <ChevronLeft className={iconClass} strokeWidth={stroke} aria-hidden />
      );
    case "right":
      return (
        <ChevronRight className={iconClass} strokeWidth={stroke} aria-hidden />
      );
    case "up":
      return (
        <ChevronUp className={iconClass} strokeWidth={stroke} aria-hidden />
      );
    case "down":
      return (
        <ChevronDown className={iconClass} strokeWidth={stroke} aria-hidden />
      );
    default:
      return (
        <ChevronRight className={iconClass} strokeWidth={stroke} aria-hidden />
      );
  }
};

const RecordsCalendar: React.FC<IProps> = ({ records }) => {
  const today = new Date();
  const searchParams = useSearchParams();
  const { replaceQueryParams } = useReplaceQueryParams();

  const selectedDate = useMemo(
    () => getSelectedDateFromQuery((k) => searchParams.get(k)),
    [searchParams],
  );

  const calendarMonth = useMemo(
    () => startOfMonth(selectedDate),
    [selectedDate],
  );

  /** 쿼리 없음·형식 오류 시 정규화된 `date`로 맞춤 */
  useEffect(() => {
    const raw = searchParams.get(DATE_QUERY_KEY);
    const ymd = format(selectedDate, "yyyy-MM-dd");

    if (raw !== ymd) replaceQueryParams({ [DATE_QUERY_KEY]: ymd });
  }, [selectedDate, searchParams, replaceQueryParams]);

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const datesWithRecord = useMemo(
    () => records.map((r) => toLocalDate(r.date)),
    [records],
  );

  const setDateQuery = useCallback(
    (d: Date) => {
      replaceQueryParams({
        [DATE_QUERY_KEY]: format(clampSelectedDate(d), "yyyy-MM-dd"),
      });
    },
    [replaceQueryParams],
  );

  /** 월 화살표: 같은 일(가능한 범위)로 이동 */
  const handleMonthChange = useCallback(
    (month: Date) => {
      const y = month.getFullYear();
      const m = month.getMonth();
      const maxDay = new Date(y, m + 1, 0).getDate();
      const day = Math.min(selectedDate.getDate(), maxDay);
      setDateQuery(new Date(y, m, day));
    },
    [selectedDate, setDateQuery],
  );

  const handleSelectDate = useCallback(
    (d: Date) => {
      setDateQuery(d);
    },
    [setDateQuery],
  );

  const handleOpenMonthPicker = useCallback(() => {
    setMonthPickerOpen(true);
  }, []);

  const CustomCaptionLabel = ({ children, ...props }: CaptionLabelProps) => (
    <button
      type="button"
      onClick={handleOpenMonthPicker}
      className="text-sm font-semibold text-on-surface transition-opacity active:opacity-70"
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );

  return (
    <>
      <Calendar
        mode="single"
        navLayout="around"
        month={calendarMonth}
        onMonthChange={handleMonthChange}
        selected={selectedDate}
        onSelect={(d) => d && handleSelectDate(d)}
        modifiers={{ hasRecord: datesWithRecord }}
        components={{
          Chevron: RecordsCalendarChevron,
          DayButton: RecordDayButton,
          CaptionLabel: CustomCaptionLabel,
        }}
        disabled={(date) => date > today}
        startMonth={CALENDAR_START}
        endMonth={today}
        className="relative mx-auto mt-4 w-full max-w-sm rounded-2xl bg-surface-container p-4"
        classNames={{
          month: "relative space-y-1",
          month_grid: "w-full",
          month_caption: "relative flex h-10 items-center justify-center px-12",
          button_previous:
            "absolute left-0 top-0 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-30",
          button_next:
            "absolute right-0 top-0 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-30",
        }}
      />

      <RecordsCalendarBottomSheet
        open={monthPickerOpen}
        onOpenChange={setMonthPickerOpen}
      />
    </>
  );
};

const RecordDayButton = ({
  day,
  modifiers,
  className,
  ...props
}: DayButtonProps) => (
  <button {...props} className={cn(className, "relative")}>
    {day.date.getDate()}
    {(modifiers as Record<string, boolean>).hasRecord && (
      <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
    )}
  </button>
);

export default RecordsCalendar;
