import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";
import { Button } from "#/src/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const AdminReportsPageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <Skeleton className="mb-2 h-8 w-32 bg-muted/70" />
          <Skeleton className="h-4 w-48 bg-muted/70" />
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Skeleton className="h-10 w-full bg-muted/70" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-[150px] bg-muted/70" />
          <Skeleton className="h-10 w-[150px] bg-muted/70" />
        </div>
      </div>

      {/* 테이블 */}
      <div className="clog-section rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <Skeleton className="h-6 w-32 bg-muted/70" />
          <Skeleton className="h-8 w-24 bg-muted/70" />
        </div>
        <div className="space-y-4 p-4">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full bg-muted/70" />
            ))}
          </div>
          {/* 테이블 행 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, j) => (
                <Skeleton key={j} className="h-16 w-full bg-muted/70" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 bg-muted/70" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 bg-muted/70" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 bg-muted/70" />
            ))}
          </div>
          <Skeleton className="h-8 w-16 bg-muted/70" />
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPageSkeleton;
