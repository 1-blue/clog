"use client";

import * as React from "react";

import { cn } from "#web/libs/utils";

type TChipSize = "xs" | "sm";

interface IProps {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  size?: TChipSize;
  className?: string;
}

const FilterChip: React.FC<IProps> = ({
  label,
  selected,
  onClick,
  size = "sm",
  className,
}) => {
  const sizeClasses =
    size === "xs"
      ? "px-3 py-1.5 text-xs font-medium"
      : "px-5 py-2 text-sm font-semibold";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 cursor-pointer rounded-full transition-colors",
        sizeClasses,
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-surface-container-high text-on-surface-variant",
        className,
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};

export default FilterChip;
