import type { ReactNode } from "react";

import { cn } from "#web/libs/utils";

interface IProps {
  children: ReactNode;
  className?: string;
}

const SettingsListGroup = ({ children, className }: IProps) => {
  return (
    <div
      className={cn(
        "divide-y divide-outline-variant/50 overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/40",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SettingsListGroup;
