# Skill: list-page — 리스트 페이지 생성

## 목적
데이터 목록을 보여주는 페이지를 생성한다.
관리자 테이블, 공개 카드 그리드 등 **모든 영역의 리스트**에 사용한다.

## 레이아웃 변형

| 영역 | 레이아웃 | 특징 |
|---|---|---|
| 관리자 | 테이블 (TanStack Table) | 필터, 정렬, 페이지네이션, 관리 액션 |
| 공개/인증 | 카드 그리드 | 반응형 그리드, 간결한 정보 |

## 생성 파일

```
{routePath}/
├── page.tsx
└── _source/
    └── components/
        ├── {Feature}Page.tsx
        └── {Feature}PageSkeleton.tsx
```

## page.tsx (공통)

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import {Feature}Page from "./_source/components/{Feature}Page";
import {Feature}PageSkeleton from "./_source/components/{Feature}PageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "{제목}" });

const Page = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<{Feature}PageSkeleton />}>
        <{Feature}Page />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
```

## 테이블 리스트 (관리자 등 데이터 관리 목적)

```tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowLeft, Search } from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspense{Feature}s,
  useDelete{Feature},
} from "#/src/hooks/queries/use-{feature-kebab}";
import { Button } from "#/src/components/ui/button";
import { Input } from "#/src/components/ui/input";
import { Badge } from "#/src/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "#/src/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "#/src/components/ui/select";

type {Feature} = Database["public"]["Tables"]["{table}"]["Row"];

const {Feature}Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: items } = useSuspense{Feature}s();
  const delete{Feature} = useDelete{Feature}();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 필터링
  const filteredData = useMemo(() => {
    if (!items) return [];
    let filtered = items;
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [items, searchQuery]);

  // 정렬
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.length > 0) {
      const sort = sorting[0];
      sorted.sort((a, b) => {
        if (sort.id === "created_at") {
          const aDate = a.created_at ? parseISO(a.created_at).getTime() : 0;
          const bDate = b.created_at ? parseISO(b.created_at).getTime() : 0;
          return sort.desc ? bDate - aDate : aDate - bDate;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // URL 동기화
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl({ search: value, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, displayName: string) => {
    if (!confirm(`"${displayName}"을(를) 삭제하시겠습니까?`)) return;
    try {
      await delete{Feature}.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다");
    }
  };

  const columns: ColumnDef<{Feature}>[] = [
    // 이미지/요구사항에 맞게 컬럼 정의
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{제목}</h1>
      </div>

      {/* 검색 + 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {/* 필터 Select — 필요한 만큼 추가 */}
      </div>

      {/* 테이블 */}
      <div className="clog-section rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">총 {sortedData.length}건</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
            이전
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(p)} className="h-8 w-8">
                {p}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default {Feature}Page;
```

## 카드 그리드 리스트 (공개/인증 사용자 대상)

```tsx
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { routes } from "@clog/libs";
import { useSuspense{Feature}s } from "#/src/hooks/queries/use-{feature-kebab}";
import { Input } from "#/src/components/ui/input";
import { Button } from "#/src/components/ui/button";
import { Badge } from "#/src/components/ui/badge";

const {Feature}ListPage: React.FC = () => {
  const { data: items } = useSuspense{Feature}s();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{제목}</h1>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} href={routes.{feature}.detail.url(item.id)}
            className="clog-section hover:shadow-md transition-shadow">
            <h3 className="font-semibold">{item.name}</h3>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default {Feature}ListPage;
```

## Skeleton (공통)

```tsx
import * as React from "react";
import { Skeleton } from "#/src/components/ui/skeleton";
import { Button } from "#/src/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const {Feature}PageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="h-8 w-32 bg-muted/70" />
      </div>
      <div className="clog-section">
        <Skeleton className="h-10 w-full bg-muted/70" />
      </div>
      <div className="clog-section rounded-md border">
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-muted/70" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default {Feature}PageSkeleton;
```

## 필터 추가 패턴 (어디서든 동일)

```tsx
// state
const [selectedFilter, setSelectedFilter] = useState(searchParams.get("key") || "all");

// handler
const handleFilterChange = (value: string | null) => {
  const v = value || "all";
  setSelectedFilter(v);
  updateUrl({ key: v, page: "1" });
};

// filteredData 내 조건 추가
if (selectedFilter !== "all") {
  filtered = filtered.filter((item) => item.column === selectedFilter);
}

// JSX
<Select value={selectedFilter} onValueChange={handleFilterChange}>
  <SelectTrigger className="w-full md:w-[150px]">
    <SelectValue>전체</SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">전체</SelectItem>
    {/* ... */}
  </SelectContent>
</Select>
```

## 통계 카드 추가 패턴

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div className="clog-section">
    <div className="text-2xl font-bold">{stats.total}</div>
    <div className="text-sm text-gray-500">전체</div>
  </div>
</div>
```
