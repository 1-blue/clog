"use client";

import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import * as React from "react";

import { cn } from "#web/libs/utils";

const Calendar = ({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) => (
  <DayPicker
    locale={ko}
    className={cn("relative", className)}
    classNames={{
      months: "flex flex-col",
      month: "space-y-1",
      month_caption: "relative flex h-10 items-center justify-center px-1",
      caption_label: "text-sm font-semibold text-on-surface",
      nav: "absolute inset-x-0 top-0 flex h-full items-center justify-between",
      button_previous: "hidden",
      button_next: "hidden",
      month_grid: "w-full border-collapse",
      weekdays: "flex justify-evenly",
      weekday:
        "flex size-9 items-center justify-center text-xs font-medium text-on-surface-variant",
      weeks: "mt-1",
      week: "flex justify-evenly",
      day: "relative flex size-9 items-center justify-center cursor-pointer",
      day_button:
        "size-9 rounded-full text-sm font-normal text-on-surface transition-colors hover:bg-surface-container-high focus:outline-none",
      selected: "!bg-primary/30 !text-primary-foreground !rounded-full",
      today: "",
      outside: "text-on-surface-variant opacity-40",
      disabled: "text-on-surface-variant opacity-30 cursor-not-allowed",
      hidden: "invisible",
      range_start: "!bg-primary !text-primary-foreground !rounded-full",
      range_end: "!bg-primary !text-primary-foreground !rounded-full",
      range_middle: "bg-primary/20 rounded-none",
      ...classNames,
    }}
    {...props}
  />
);

export { Calendar };
