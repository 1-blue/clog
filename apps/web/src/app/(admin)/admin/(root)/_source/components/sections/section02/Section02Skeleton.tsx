import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";

const Section02Skeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="clog-section">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-12 w-12 rounded-lg bg-muted/70" />
            <Skeleton className="h-4 w-20 bg-muted/70" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <Skeleton className="h-8 w-16 bg-muted/70" />
            <Skeleton className="h-4 w-24 bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Section02Skeleton;
