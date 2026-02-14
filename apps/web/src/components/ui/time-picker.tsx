"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { cn } from "@clog/libs";
import { buttonVariants } from "#/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/src/components/ui/popover";

type TimePickerProps = {
  value?: string; // HH:MM 형식
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function TimePicker({
  value,
  onChange,
  placeholder = "시간 선택",
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState<number>(
    value ? parseInt(value.split(":")[0]) : 9
  );
  const [minutes, setMinutes] = React.useState<number>(
    value ? parseInt(value.split(":")[1]) : 0
  );

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);
    const timeString = `${String(newHours).padStart(2, "0")}:${String(
      newMinutes
    ).padStart(2, "0")}`;
    onChange?.(timeString);
  };

  const displayValue = value
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        disabled={disabled}
      >
        <ClockIcon className="mr-2 h-4 w-4" />
        {displayValue}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        {/* 선택된 시간 표시 */}
        <div className="text-center">
          <div className="mb-0.5 text-xl font-semibold">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
          </div>
          <div className="text-muted-foreground text-xs">선택된 시간</div>
        </div>

        <div className="flex items-start gap-6">
          {/* 시간 선택 */}
          <div className="flex-1">
            <div className="text-muted-foreground mb-1.5 text-center text-sm font-medium">
              시간
            </div>
            <div className="flex max-h-32 flex-col gap-0.5 overflow-y-auto pr-1">
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleTimeChange(h, minutes)}
                  className={cn(
                    "h-7 w-full rounded-md text-center text-sm transition-colors",
                    hours === h
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {String(h).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* 분 선택 */}
          <div className="flex-1">
            <div className="text-muted-foreground mb-1.5 text-center text-sm font-medium">
              분
            </div>
            <div className="flex max-h-32 flex-col gap-0.5 overflow-y-auto pr-1">
              {[0, 15, 30, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleTimeChange(hours, m)}
                  className={cn(
                    "h-7 w-full rounded-md text-center text-sm transition-colors",
                    minutes === m
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {String(m).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { TimePicker };
