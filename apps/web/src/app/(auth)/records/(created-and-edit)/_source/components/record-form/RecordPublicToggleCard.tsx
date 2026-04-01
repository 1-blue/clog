"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { Switch } from "#web/components/ui/switch";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  className?: string;
}

const RecordPublicToggleCard = ({ className }: IProps) => {
  const { control, setValue } = useFormContext<TRecordFormData>();
  const isPublic = useWatch({ control, name: "isPublic" });

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3.5",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className={recordFormFieldLabelClass}>커뮤니티 공개</p>
        <p className="mt-1 text-xs leading-snug text-on-surface-variant">
          피드에 노출되어 다른 클라이머와 기록을 나눌 수 있어요
        </p>
      </div>
      <Switch
        checked={isPublic}
        onCheckedChange={(v) => setValue("isPublic", v)}
      />
    </div>
  );
};

export default RecordPublicToggleCard;
