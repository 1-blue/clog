"use client";

import { ListPlus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";

import type { IRecordSessionRouteEntry } from "#web/app/(auth)/records/_source/components/record-session-types";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import RecordRouteAddSheet from "./RecordRouteAddSheet";
import RecordRouteRow from "./RecordRouteRow";

interface IProps {
  className?: string;
}

const RecordRoutesSection = ({ className }: IProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { control, setValue } = useFormContext<TRecordFormData>();
  const routes = useWatch({ control, name: "routes" }) ?? [];

  const handleAdd = (entry: IRecordSessionRouteEntry) => {
    setValue("routes", [...routes, entry], { shouldValidate: true });
  };

  const handleRemove = (index: number) => {
    setValue(
      "routes",
      routes.filter((_, idx) => idx !== index),
      { shouldValidate: true },
    );
  };

  const handleChangeAttempts = (index: number, attempts: number) => {
    setValue(
      "routes",
      routes.map((r, idx) => (idx === index ? { ...r, attempts } : r)),
    );
  };

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-outline uppercase">
          완등한 루트
        </span>
        <span className="text-xs text-on-surface-variant">
          {routes.length}개 루트
        </span>
      </div>

      <div className="space-y-2">
        {routes.map((route, i) => (
          <RecordRouteRow
            key={i}
            difficulty={route.difficulty}
            result={route.result}
            attempts={route.attempts}
            onChangeAttempts={(n) => handleChangeAttempts(i, n)}
            onRemove={() => handleRemove(i)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low py-3.5 text-sm font-semibold text-on-surface transition-colors hover:border-primary/40 hover:bg-surface-container-high"
      >
        <ListPlus className="size-5 text-primary" strokeWidth={2} />
        난이도 추가
      </button>

      <RecordRouteAddSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAdd={handleAdd}
      />
    </section>
  );
};

export default RecordRoutesSection;
