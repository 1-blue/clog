"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Eye, Trash2, Search } from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspenseSessions,
  useDeleteSession,
} from "#/src/hooks/queries/use-sessions";
import { Button } from "#/src/components/ui/button";
import { Input } from "#/src/components/ui/input";
import { Badge } from "#/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/src/components/ui/select";

type Session = Database["public"]["Tables"]["sessions"]["Row"] & {
  profiles?: { id: string; nickname: string } | null;
  gyms?: { id: string; name: string } | null;
};

// 컨디션 라벨 및 색상
const getConditionInfo = (condition: string | null) => {
  if (!condition) return { label: "-", color: "bg-gray-100 text-gray-700" };
  const map: Record<string, { label: string; color: string }> = {
    good: { label: "좋음", color: "bg-green-100 text-green-700" },
    normal: { label: "보통", color: "bg-yellow-100 text-yellow-700" },
    bad: { label: "나쁨", color: "bg-red-100 text-red-700" },
  };
  return map[condition] || { label: condition, color: "bg-gray-100 text-gray-700" };
};

// 등급 색상 매핑
const getGradeColor = (grade: string | null) => {
  if (!grade) return "bg-gray-100 text-gray-700";
  const gradeNum = parseInt(grade.replace("V", "")) || 0;
  if (gradeNum >= 5) return "bg-purple-100 text-purple-700";
  if (gradeNum >= 4) return "bg-blue-100 text-blue-700";
  if (gradeNum >= 3) return "bg-cyan-100 text-cyan-700";
  return "bg-gray-100 text-gray-700";
};

const AdminSessionsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: sessions } = useSuspenseSessions();
  const deleteSession = useDeleteSession();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "latest"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!sessions) return [];

    let filtered = sessions;

    // 검색 필터 (사용자명, 암장명, 등급)
    if (searchQuery) {
      filtered = filtered.filter((session) => {
        const userNickname =
          session.profiles && typeof session.profiles === "object" && "nickname" in session.profiles
            ? (session.profiles as { nickname: string }).nickname
            : "";
        const gymName =
          session.gyms && typeof session.gyms === "object" && "name" in session.gyms
            ? (session.gyms as { name: string }).name
            : "";
        const grade = session.max_grade || "";

        return (
          userNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grade.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [sessions, searchQuery]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (selectedSort === "latest") {
      sorted.sort((a, b) => {
        const aDate = a.date ? parseISO(a.date).getTime() : 0;
        const bDate = b.date ? parseISO(b.date).getTime() : 0;
        return bDate - aDate;
      });
    } else if (selectedSort === "oldest") {
      sorted.sort((a, b) => {
        const aDate = a.date ? parseISO(a.date).getTime() : 0;
        const bDate = b.date ? parseISO(b.date).getTime() : 0;
        return aDate - bDate;
      });
    }
    return sorted;
  }, [filteredData, selectedSort]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, page]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // URL 업데이트 함수
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

  // 검색 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl({ search: value, page: "1" });
  };

  // 정렬 핸들러
  const handleSortChange = (value: string | null) => {
    const newValue = value || "latest";
    setSelectedSort(newValue);
    updateUrl({ sort: newValue, page: "1" });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 삭제 핸들러
  const handleDelete = async (sessionId: string) => {
    if (!confirm("이 세션을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteSession.mutateAsync(sessionId);
    } catch (error) {
      console.error("Error deleting session:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`세션 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  // 컬럼 정의
  const columns: ColumnDef<Session>[] = [
    {
      id: "user",
      header: "사용자",
      cell: ({ row }) => {
        const session = row.original;
        const userNickname =
          session.profiles && typeof session.profiles === "object" && "nickname" in session.profiles
            ? (session.profiles as { nickname: string }).nickname
            : "알 수 없음";
        return (
          <Button
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={() => {
              // TODO: 사용자 상세 페이지로 이동
              console.log("View user:", session.user_id);
            }}
          >
            {userNickname}
          </Button>
        );
      },
    },
    {
      id: "gym",
      header: "암장",
      cell: ({ row }) => {
        const session = row.original;
        const gymName =
          session.gyms && typeof session.gyms === "object" && "name" in session.gyms
            ? (session.gyms as { name: string }).name
            : "알 수 없음";
        return (
          <Button
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={() => {
              // TODO: 암장 상세 페이지로 이동
              console.log("View gym:", session.gym_id);
            }}
          >
            {gymName}
          </Button>
        );
      },
    },
    {
      accessorKey: "date",
      header: "운동일",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        if (!date) return <div>-</div>;
        return (
          <div>{format(parseISO(date), "yyyy. M. d.", { locale: ko })}</div>
        );
      },
    },
    {
      id: "sends_attempts",
      header: "완등/시도",
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div>
            <span className="text-green-600 font-semibold">
              {session.completed_count || 0}
            </span>{" "}
            / {session.attempt_count || 0}
          </div>
        );
      },
    },
    {
      accessorKey: "max_grade",
      header: "최고등급",
      cell: ({ row }) => {
        const grade = row.getValue("max_grade") as string | null;
        if (!grade) return <div>-</div>;
        return (
          <Badge variant="outline" className={cn(getGradeColor(grade))}>
            {grade}
          </Badge>
        );
      },
    },
    {
      accessorKey: "condition",
      header: "컨디션",
      cell: ({ row }) => {
        const condition = row.getValue("condition") as string | null;
        const conditionInfo = getConditionInfo(condition);
        return (
          <Badge variant="outline" className={cn(conditionInfo.color)}>
            {conditionInfo.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                // TODO: 세션 상세 페이지로 이동
                console.log("View session:", session.id);
              }}
            >
              상세
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDelete(session.id)}
              disabled={deleteSession.isPending}
            >
              삭제
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">세션 관리</h1>
          <p className="text-muted-foreground text-sm">
            모든 클라이밍 세션을 관리합니다
          </p>
        </div>
      </div>

      {/* 검색 및 정렬 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="사용자명, 암장명, 등급으로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>정렬:</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="clog-section rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">세션 목록 ({sortedData.length}개)</h2>
          <Button variant="outline" size="sm">
            전체 선택
          </Button>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  세션이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}개의 세션
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            이전
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(p)}
                className="h-8 w-8"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSessionsPage;
