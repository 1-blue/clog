"use client";

import { format, isValid, parse, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Calendar } from "#web/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import { cn } from "#web/libs/utils";

const navButtonClass =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-5";

interface IProps {
  label: string;
  sheetTitle?: string;
  valueYmd: string;
  onChangeYmd: (ymd: string) => void;
  /** 오늘 이후 날짜 비활성 (기본 true — 방문일 등) */
  disableFuture?: boolean;
  /** 오늘 이전 날짜 비활성 */
  disablePast?: boolean;
  className?: string;
}

const YmdSheetDateField = ({
  label,
  sheetTitle = "날짜 선택",
  valueYmd,
  onChangeYmd,
  disableFuture = false,
  disablePast = false,
  className,
}: IProps) => {
  const [open, setOpen] = useState(false);

  const parsed = parse(valueYmd, "yyyy-MM-dd", new Date());
  const selected = isValid(parsed) ? parsed : new Date();
  const today = startOfDay(new Date());

  const labelText = format(selected, "yyyy년 M월 d일 (EEE)", { locale: ko });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-on-surface">{label}</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-outline-variant/40 bg-surface-container-high px-4 py-3.5 text-left transition-colors hover:bg-surface-container"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
              <CalendarDays
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden
              />
            </span>
            <span className="text-sm font-medium text-on-surface">
              {labelText}
            </span>
          </span>
          <ChevronDown
            className="size-5 shrink-0 text-on-surface-variant"
            aria-hidden
          />
        </button>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t border-outline-variant bg-surface-container"
          showCloseButton
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-on-surface">{sheetTitle}</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center pb-6">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  onChangeYmd(format(d, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              defaultMonth={selected}
              disabled={(d) => {
                const day = startOfDay(d);
                if (disableFuture && day > today) return true;
                if (disablePast && day < today) return true;
                return false;
              }}
              classNames={{
                nav: "absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between",
                button_previous: navButtonClass,
                button_next: navButtonClass,
                chevron: "fill-current text-on-surface",
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default YmdSheetDateField;
