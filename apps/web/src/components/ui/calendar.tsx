"use client";

import { ko } from "date-fns/locale";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "#web/libs/utils";

import "react-day-picker/style.css";

const Calendar = ({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) => (
  <DayPicker
    locale={ko}
    className={cn("rounded-2xl p-2 [--rdp-accent-color:var(--primary)]", className)}
    {...props}
  />
);

export { Calendar };
