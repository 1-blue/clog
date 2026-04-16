import * as React from "react";

interface IProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const AdminPageHeader: React.FC<IProps> = ({ title, description, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-outline-variant pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
};

export default AdminPageHeader;
