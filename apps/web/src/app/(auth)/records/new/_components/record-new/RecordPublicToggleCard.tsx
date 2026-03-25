"use client";

import { Globe2 } from "lucide-react";

import { Switch } from "#web/components/ui/switch";
import { cn } from "#web/libs/utils";

interface IProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
}

const RecordPublicToggleCard = ({
  checked,
  onCheckedChange,
  className,
}: IProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3.5",
      className,
    )}
  >
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12">
        <Globe2 className="size-4 text-primary" strokeWidth={2} />
      </span>
      <div>
        <p className="font-semibold text-on-surface">커뮤니티 공개</p>
        <p className="text-xs leading-snug text-on-surface-variant">
          피드에 노출되어 다른 클라이머와 기록을 나눌 수 있어요
        </p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default RecordPublicToggleCard;
