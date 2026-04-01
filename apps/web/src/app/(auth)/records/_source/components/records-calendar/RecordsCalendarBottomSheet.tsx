"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Sheet, SheetContent } from "#web/components/ui/sheet";
import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";
import { cn } from "#web/libs/utils";

import {
  CALENDAR_START,
  clampSelectedDate,
  DATE_QUERY_KEY,
  getSelectedDateFromQuery,
} from "../../utils/records-list-date";

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

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecordsCalendarBottomSheet: React.FC<IProps> = ({
  open,
  onOpenChange,
}) => {
  const searchParams = useSearchParams();
  const { replaceQueryParams } = useReplaceQueryParams();

  const selectedDate = useMemo(
    () => getSelectedDateFromQuery((k) => searchParams.get(k)),
    [searchParams],
  );

  const [pickerYear, setPickerYear] = useState(() =>
    selectedDate.getFullYear(),
  );

  const handleSheetOpenChange = useCallback(
    (next: boolean) => {
      if (next) setPickerYear(selectedDate.getFullYear());
      onOpenChange(next);
    },
    [onOpenChange, selectedDate],
  );

  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      const d = clampSelectedDate(new Date(pickerYear, monthIndex, 1));
      replaceQueryParams({ [DATE_QUERY_KEY]: format(d, "yyyy-MM-dd") });
      onOpenChange(false);
    },
    [pickerYear, replaceQueryParams, onOpenChange],
  );

  const handlePickerYearPrev = useCallback(() => {
    if (pickerYear > CALENDAR_START.getFullYear()) setPickerYear((y) => y - 1);
  }, [pickerYear]);

  const handlePickerYearNext = useCallback(() => {
    const maxY = new Date().getFullYear();
    if (pickerYear < maxY) setPickerYear((y) => y + 1);
  }, [pickerYear]);

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-3xl border-t border-outline-variant bg-surface-container px-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-10 rounded-full bg-outline-variant" />

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
            disabled={pickerYear >= new Date().getFullYear()}
            className="flex size-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-4">
          {MONTH_LABELS.map((label, idx) => {
            const now = new Date();
            const isFuture =
              pickerYear > now.getFullYear() ||
              (pickerYear === now.getFullYear() && idx > now.getMonth());
            const isPast =
              pickerYear < CALENDAR_START.getFullYear() ||
              (pickerYear === CALENDAR_START.getFullYear() &&
                idx < CALENDAR_START.getMonth());
            const isSelected =
              pickerYear === selectedDate.getFullYear() &&
              idx === selectedDate.getMonth();
            const isCurrentMonth =
              pickerYear === now.getFullYear() && idx === now.getMonth();

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
  );
};

export default RecordsCalendarBottomSheet;
