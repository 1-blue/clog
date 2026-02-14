import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";
import { Button } from "#/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminGymEditPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 상단 섹션 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="h-8 w-32 bg-muted/70" />
      </div>

      {/* 폼 스켈레톤 */}
      <div className="space-y-5">
        {/* 기본 정보 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-muted/70" />
                <Skeleton className="h-10 w-full bg-muted/70" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-muted/70" />
                <Skeleton className="h-10 w-full bg-muted/70" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 bg-muted/70" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-muted/70" />
                  <Skeleton className="h-10 w-full bg-muted/70" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-muted/70" />
                  <Skeleton className="h-10 w-full bg-muted/70" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 bg-muted/70" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-muted/70" />
                  <Skeleton className="h-10 w-full bg-muted/70" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-muted/70" />
                  <Skeleton className="h-10 w-full bg-muted/70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 시설 정보 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
          </div>
        </div>

        {/* 가격 정보 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-muted/70" />
              <Skeleton className="h-10 w-full bg-muted/70" />
            </div>
          </div>
        </div>

        {/* 편의시설 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded bg-muted/70" />
                <Skeleton className="h-4 w-16 bg-muted/70" />
              </div>
            ))}
          </div>
        </div>

        {/* 문제 타입 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded bg-muted/70" />
                <Skeleton className="h-4 w-20 bg-muted/70" />
              </div>
            ))}
          </div>
        </div>

        {/* 상태 섹션 */}
        <div className="clog-section">
          <Skeleton className="mb-4 h-6 w-24 bg-muted/70" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-muted/70" />
            <Skeleton className="h-10 w-full max-w-xs bg-muted/70" />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-24 bg-muted/70" />
        </div>
      </div>
    </div>
  );
};

export default AdminGymEditPageSkeleton;
