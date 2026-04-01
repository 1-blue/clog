"use client";

import type { LucideIcon } from "lucide-react";

import { Label } from "#web/components/ui/label";
import { Switch } from "#web/components/ui/switch";
import { cn } from "#web/libs/utils";

interface IProps {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
}

const SettingsSwitchRow: React.FC<IProps> = ({
  id,
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-container-high/80",
        disabled && "opacity-60",
      )}
    >
      <Icon
        className="size-5 shrink-0 text-on-surface-variant"
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <Label htmlFor={id} className="text-sm font-medium text-on-surface">
          {label}
        </Label>
        {description ? (
          <p className="mt-0.5 text-xs text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

export default SettingsSwitchRow;
