"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Textarea } from "#web/components/ui/textarea";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  className?: string;
}

const RecordMemoField = ({ className }: IProps) => {
  const { control } = useFormContext<TRecordFormData>();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className={recordFormFieldLabelClass}>오늘의 메모</span>
      <Controller
        control={control}
        name="memo"
        render={({ field }) => (
          <Textarea
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="느낌 점, 베스트 루트, 아쉬웠던 점을 적어보세요…"
            rows={4}
            className="w-full resize-none rounded-2xl border border-transparent bg-surface-container-high px-4 py-3 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
          />
        )}
      />
    </div>
  );
};

export default RecordMemoField;
