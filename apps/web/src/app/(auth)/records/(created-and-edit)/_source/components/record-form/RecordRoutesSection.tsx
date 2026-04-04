"use client";

import { ListPlus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useMemo, useState } from "react";

import type { IRecordSessionRouteEntry } from "#web/app/(auth)/records/(created-and-edit)/_source/types/record-session-types";
import type { TGymDifficultyColor } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";
import RecordRouteAddSheet from "./RecordRouteAddSheet";
import RecordRouteRow from "./RecordRouteRow";

interface IProps {
  className?: string;
  difficultyColors?: TGymDifficultyColor[];
}

const RecordRoutesSection = ({ className, difficultyColors }: IProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const routes = useWatch({ control, name: "routes" }) ?? [];

  const canEditRoutes = Boolean(gymId);

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

  const routeAddSheetKey = useMemo(
    () =>
      difficultyColors?.length
        ? difficultyColors.map((c) => c.id).join("-")
        : "default-order",
    [difficultyColors],
  );

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className={recordFormFieldLabelClass}>완등한 루트</span>
        <span className="text-xs text-on-surface-variant">
          {routes.length}개 루트
        </span>
      </div>

      {canEditRoutes && routes.length === 0 ? (
        <p className="text-xs text-on-surface-variant">
          루트 없이 방문만 기록할 수 있어요. 아래에서 난이도를 추가할 수도 있어요.
        </p>
      ) : null}

      {!canEditRoutes && (
        <p className="text-xs text-on-surface-variant">
          암장을 먼저 선택하면 난이도를 추가할 수 있어요
        </p>
      )}

      {routes.length > 0 && (
        <div className="flex flex-col gap-2">
          {routes.map((route, i) => (
            <RecordRouteRow
              key={i}
              difficulty={route.difficulty}
              result={route.result}
              attempts={route.attempts}
              difficultyColors={difficultyColors}
              onChangeAttempts={(n) => handleChangeAttempts(i, n)}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={!canEditRoutes}
        onClick={() => canEditRoutes && setSheetOpen(true)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low py-3.5 text-sm font-semibold transition-colors",
          canEditRoutes
            ? "text-on-surface hover:border-primary/40 hover:bg-surface-container-high"
            : "cursor-not-allowed text-on-surface-variant opacity-60",
        )}
      >
        <ListPlus className="size-5 text-primary" strokeWidth={2} />
        난이도 추가
      </button>

      {canEditRoutes && (
        <RecordRouteAddSheet
          key={routeAddSheetKey}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onAdd={handleAdd}
          difficultyColors={difficultyColors}
        />
      )}

      {errors.routes?.message && (
        <p className="text-sm text-destructive" role="alert">
          {errors.routes.message}
        </p>
      )}
    </section>
  );
};

export default RecordRoutesSection;
