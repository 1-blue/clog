import { Inbox, type LucideIcon } from "lucide-react";
import React from "react";

interface IProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<IProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon className="size-12 text-on-surface-variant" />
      <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant">{description}</p>
      )}
      {action}
    </div>
  );
};
export default EmptyState;
