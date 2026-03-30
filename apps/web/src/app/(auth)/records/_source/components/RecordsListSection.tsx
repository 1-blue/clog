"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Mountain, Plus } from "lucide-react";
import type { CaptionLabelProps, DayButtonProps } from "react-day-picker";
import { useMemo, useState } from "react";
import Link from "next/link";

import { fetchClient } from "#web/apis/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import { Badge } from "#web/components/ui/badge";
import { Calendar } from "#web/components/ui/calendar";
import { Sheet, SheetContent } from "#web/components/ui/sheet";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import RecordDayCard from "./RecordDayCard";

/** 날짜 문자열(ISO)을 로컬 자정 Date로 변환 (타임존 안전) */
const toLocalDate = (isoDate: string): Date => {
  const [y, m, d] = isoDate.split("T")[0]!.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
};

const MONTH_LABELS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

/** 캘린더를 이 날짜 이전으로는 이동 불가 */
const CALENDAR_START = new Date(2026, 0, 1);

const RecordsListSection = () => {
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(today.getFullYear());

  const monthStr = format(calendarMonth, "yyyy-MM");

  const { data: records } = useSuspenseQuery({
    queryKey: ["get", "/api/v1/records", { month: monthStr }],
    queryFn: async () => {
      const { data: res } = await fetchClient.GET("/api/v1/records", {
        params: { query: { month: monthStr } },
      });
      return res!.payload.items;
    },
  });

  const datesWithRecord = useMemo(
    () => records.map((r) => toLocalDate(r.date)),
    [records],
  );

  const selectedDayRecords = useMemo(
    () => records.filter((r) => isSameDay(toLocalDate(r.date), selectedDate)),
    [records, selectedDate],
  );

  const totalRoutes = useMemo(
    () => selectedDayRecords.reduce((sum, r) => sum + r.routes.length, 0),
    [selectedDayRecords],
  );

  const handleMonthSelect = (monthIndex: number) => {
    setCalendarMonth(new Date(pickerYear, monthIndex, 1));
    setIsMonthPickerOpen(false);
  };

  const handlePickerYearPrev = () => {
    if (pickerYear > CALENDAR_START.getFullYear()) setPickerYear((y) => y - 1);
  };
  const handlePickerYearNext = () => {
    if (pickerYear < today.getFullYear()) setPickerYear((y) => y + 1);
  };

  /** xxxx년 xx월 클릭 → 바텀시트 오픈 (ChevronDown 없음) */
  const CustomCaptionLabel = ({ children, ...props }: CaptionLabelProps) => (
    <button
      type="button"
      onClick={() => {
        setPickerYear(calendarMonth.getFullYear());
        setIsMonthPickerOpen(true);
      }}
      className="text-sm font-semibold text-on-surface transition-opacity active:opacity-70"
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );

  return (
    <div className="px-4 pb-4">
      {/* 캘린더 */}
      <Calendar
        mode="single"
        month={calendarMonth}
        onMonthChange={setCalendarMonth}
        selected={selectedDate}
        onSelect={(d) => d && setSelectedDate(d)}
        modifiers={{ hasRecord: datesWithRecord }}
        components={{
          DayButton: RecordDayButton,
          CaptionLabel: CustomCaptionLabel,
        }}
        disabled={(date) => date > today}
        startMonth={CALENDAR_START}
        endMonth={today}
        className="mx-auto mt-8 w-full max-w-sm rounded-2xl bg-surface-container p-4"
        classNames={{ month_grid: "w-full" }}
      />

      {/* 연/월 선택 바텀시트 */}
      <Sheet open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-3xl border-t border-outline-variant bg-surface-container px-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          {/* 드래그 핸들 */}
          <div className="mx-auto mt-3 mb-4 h-1 w-10 rounded-full bg-outline-variant" />

          {/* 연도 네비게이션 */}
          <div className="flex items-center justify-between px-6 pb-4">
            <button
              type="button"
              onClick={handlePickerYearPrev}
              disabled={pickerYear <= CALENDAR_START.getFullYear()}
              className="flex size-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-base font-semibold text-on-surface">
              {pickerYear}년
            </span>
            <button
              type="button"
              onClick={handlePickerYearNext}
              disabled={pickerYear >= today.getFullYear()}
              className="flex size-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* 월 그리드 */}
          <div className="grid grid-cols-4 gap-2 px-4">
            {MONTH_LABELS.map((label, idx) => {
              const isFuture =
                pickerYear > today.getFullYear() ||
                (pickerYear === today.getFullYear() && idx > today.getMonth());
              const isPast =
                pickerYear < CALENDAR_START.getFullYear() ||
                (pickerYear === CALENDAR_START.getFullYear() &&
                  idx < CALENDAR_START.getMonth());
              const isSelected =
                pickerYear === calendarMonth.getFullYear() &&
                idx === calendarMonth.getMonth();
              const isCurrentMonth =
                pickerYear === today.getFullYear() && idx === today.getMonth();

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFuture || isPast}
                  onClick={() => handleMonthSelect(idx)}
                  className={cn(
                    "rounded-full py-3.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isCurrentMonth
                        ? "text-primary ring-1 ring-primary hover:bg-surface-container-high"
                        : "text-on-surface hover:bg-surface-container-high",
                    (isFuture || isPast) && "cursor-not-allowed opacity-30",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* 선택된 날 기록 */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-on-surface">
            {format(selectedDate, "M월 d일 (eee)의 기록", { locale: ko })}
          </h2>
          {selectedDayRecords.length > 0 && (
            <Badge variant="secondary">총 {totalRoutes}개 루트</Badge>
          )}
        </div>

        {selectedDayRecords.length === 0 ? (
          <EmptyState
            icon={Mountain}
            title="이 날의 기록이 없습니다"
            description="오늘의 클라이밍을 기록해 보세요!"
            action={
              <Link
                href={ROUTES.RECORDS.NEW.path}
                className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                기록 추가
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {selectedDayRecords.map((record) => (
              <RecordDayCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <Link
        href={ROUTES.RECORDS.NEW.path}
        className="fixed right-4 bottom-20 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-6" strokeWidth={2} />
      </Link>
    </div>
  );
};

/** 기록 있는 날에 도트 표시하는 커스텀 DayButton */
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

export default RecordsListSection;
