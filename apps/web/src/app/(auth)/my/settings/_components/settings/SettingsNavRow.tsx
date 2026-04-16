"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "#web/libs/utils";

interface IProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

const rowClass =
  "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-high/80";

const SettingsNavRow = ({
  icon: Icon,
  label,
  description,
  href,
  onClick,
}: IProps) => {
  const inner = (
    <>
      <Icon
        className="size-5 shrink-0 text-on-surface-variant"
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-on-surface-variant/70"
        strokeWidth={2}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(rowClass, "min-h-14 items-center")}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowClass, "min-h-14")}
    >
      {inner}
    </button>
  );
};

export default SettingsNavRow;
