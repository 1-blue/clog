"use client";

import { format, isValid, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";

import { Calendar } from "#web/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";

interface IProps {
  className?: string;
}

const RecordVisitDateField = ({ className }: IProps) => {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext<TRecordFormData>();
  const dateYmd = useWatch({ control, name: "dateYmd" });

  const parsed = parse(dateYmd, "yyyy-MM-dd", new Date());
  const selected = isValid(parsed) ? parsed : new Date();

  const label = format(selected, "yyyy년 M월 d일 (EEE)", { locale: ko });

  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-xs font-bold tracking-wider text-outline uppercase">
        방문 날짜
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-surface-container-high px-4 py-3.5 text-left transition-colors hover:bg-surface-container"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
              <CalendarDays
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden
              />
            </span>
            <span className="text-sm font-medium text-on-surface">{label}</span>
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
            <SheetTitle className="text-on-surface">날짜 선택</SheetTitle>
          </SheetHeader>
          <div className="flex justify-center pb-6">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  setValue("dateYmd", format(d, "yyyy-MM-dd"), {
                    shouldValidate: true,
                  });
                  setOpen(false);
                }
              }}
              defaultMonth={selected}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RecordVisitDateField;
