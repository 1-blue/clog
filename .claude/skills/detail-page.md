# Skill: detail-page — 상세 페이지 생성

## 목적
단일 항목의 상세 정보를 보여주는 페이지를 생성한다.
관리자/공개/인증 **모든 영역**에서 동일한 패턴을 사용한다.

## 생성 파일

```
{routePath}/[id]/
├── page.tsx
└── _source/
    └── components/
        ├── {Feature}DetailPage.tsx
        └── {Feature}DetailPageSkeleton.tsx
```

## page.tsx

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import {Feature}DetailPage from "./_source/components/{Feature}DetailPage";
import {Feature}DetailPageSkeleton from "./_source/components/{Feature}DetailPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "{제목} 상세" });

const Page = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<{Feature}DetailPageSkeleton />}>
        <{Feature}DetailPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
```

## 상세 페이지 컴포넌트

```tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspense{Feature},
  useDelete{Feature},
} from "#/src/hooks/queries/use-{feature-kebab}";
import { Button } from "#/src/components/ui/button";
import { Badge } from "#/src/components/ui/badge";

const {Feature}DetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { data: item } = useSuspense{Feature}(params.id as string);
  const delete{Feature} = useDelete{Feature}();

  const handleDelete = async () => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await delete{Feature}.mutateAsync(item.id);
      router.push(routes.{backRoute}.url);
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{item.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* 수정 링크 (수정 기능이 있을 때) */}
          <Link href={routes.{feature}.edit.url(item.id)}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              수정
            </Button>
          </Link>
          {/* 삭제 (삭제 기능이 있을 때) */}
          <Button variant="destructive" onClick={handleDelete} disabled={delete{Feature}.isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      {/* 상세 내용 — 이미지에 맞게 구성 */}
      <div className="clog-section space-y-4">
        {/* 정보 항목들 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-500">라벨</div>
            <div className="font-medium">{item.field}</div>
          </div>
        </div>
      </div>

      {/* 관련 섹션 (댓글, 기록 등) */}
    </div>
  );
};

export default {Feature}DetailPage;
```

## Skeleton

```tsx
import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";
import { Button } from "#/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

const {Feature}DetailPageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48 bg-muted/70" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 bg-muted/70" />
          <Skeleton className="h-9 w-20 bg-muted/70" />
        </div>
      </div>
      <div className="clog-section space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-16 bg-muted/70" />
              <Skeleton className="h-6 w-40 bg-muted/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {Feature}DetailPageSkeleton;
```
