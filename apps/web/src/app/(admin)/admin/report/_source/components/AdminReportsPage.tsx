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
import { ArrowLeft, Search, X, CheckCircle } from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspenseReports,
  useUpdateReport,
  useDeleteReport,
} from "#/src/hooks/queries/use-reports";
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

type Report = Database["public"]["Tables"]["reports"]["Row"] & {
  reporter_nickname: string | null;
};

// 신고 타입 라벨 매핑
const getTargetTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    user: "사용자",
    community_post: "게시글",
    gym: "암장",
  };
  return map[type] || type;
};

// 신고 타입 색상 매핑
const getTargetTypeColor = (type: string) => {
  const map: Record<string, string> = {
    user: "bg-pink-100 text-pink-700",
    community_post: "bg-blue-100 text-blue-700",
    gym: "bg-green-100 text-green-700",
  };
  return map[type] || "bg-gray-100 text-gray-700";
};

// 신고 카테고리 라벨 매핑
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    spam: "스팸",
    inappropriate: "부적절한 내용",
    fake: "허위 정보",
    harassment: "괴롭힘",
    copyright: "저작권 침해",
    other: "기타",
  };
  return map[category] || category;
};

// 상태 라벨 및 색상
const getStatusInfo = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: "대기", color: "bg-yellow-100 text-yellow-700" },
    reviewed: { label: "검토중", color: "bg-blue-100 text-blue-700" },
    resolved: { label: "해결", color: "bg-green-100 text-green-700" },
    rejected: { label: "기각", color: "bg-gray-100 text-gray-700" },
  };
  return map[status] || { label: status, color: "bg-gray-100 text-gray-700" };
};

const AdminReportsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: reports } = useSuspenseReports();
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!reports) return [];

    let filtered = reports;

    // 검색 필터 (사유, 설명)
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (report.description &&
            report.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 상태 필터
    if (selectedStatus !== "all") {
      filtered = filtered.filter((report) => report.status === selectedStatus);
    }

    // 타입 필터
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (report) => report.target_type === selectedType
      );
    }

    return filtered;
  }, [reports, searchQuery, selectedStatus, selectedType]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.length > 0) {
      const sort = sorting[0];
      sorted.sort((a, b) => {
        if (sort.id === "created_at") {
          const aDate = a.created_at
            ? parseISO(a.created_at).getTime()
            : 0;
          const bDate = b.created_at
            ? parseISO(b.created_at).getTime()
            : 0;
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

  // 상태 필터 핸들러
  const handleStatusChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedStatus(newValue);
    updateUrl({ status: newValue, page: "1" });
  };

  // 타입 필터 핸들러
  const handleTypeChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedType(newValue);
    updateUrl({ type: newValue, page: "1" });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 해결 처리 핸들러
  const handleResolve = async (reportId: string) => {
    try {
      await updateReport.mutateAsync({
        id: reportId,
        updates: { status: "resolved" },
      });
    } catch (error) {
      console.error("Error resolving report:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`신고 처리에 실패했습니다: ${errorMessage}`);
    }
  };

  // 기각 처리 핸들러
  const handleReject = async (reportId: string) => {
    if (!confirm("이 신고를 기각하시겠습니까?")) {
      return;
    }

    try {
      await updateReport.mutateAsync({
        id: reportId,
        updates: { status: "rejected" },
      });
    } catch (error) {
      console.error("Error rejecting report:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`신고 기각에 실패했습니다: ${errorMessage}`);
    }
  };

  // 삭제 핸들러
  const handleDelete = async (reportId: string) => {
    if (!confirm("이 신고를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteReport.mutateAsync(reportId);
    } catch (error) {
      console.error("Error deleting report:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`신고 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  // 컬럼 정의
  const columns: ColumnDef<Report>[] = [
    {
      id: "target_type",
      header: "타입",
      cell: ({ row }) => {
        const type = row.original.target_type;
        return (
          <Badge variant="outline" className={cn(getTargetTypeColor(type))}>
            {getTargetTypeLabel(type)}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusInfo = getStatusInfo(status);
        return (
          <Badge variant="outline" className={cn(statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      id: "title",
      header: "제목",
      cell: ({ row }) => {
        const report = row.original;
        // 타입에 따라 제목 생성 (실제로는 대상 정보를 가져와야 함)
        return (
          <div className="font-medium">
            {report.target_type === "user"
              ? "사용자 신고"
              : report.target_type === "community_post"
                ? "부적절한 게시글"
                : "부적절한 암장"}
          </div>
        );
      },
    },
    {
      id: "reporter",
      header: "신고자",
      cell: ({ row }) => {
        const report = row.original;
        const reporterId = report.reporter_id;
        const reporterNickname = report.reporter_nickname;

        const handleCopyId = async (e: React.MouseEvent) => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(reporterId);
            alert("아이디가 복사되었습니다.");
          } catch (err) {
            console.error("복사 실패:", err);
            alert("복사에 실패했습니다.");
          }
        };

        return (
          <div className="text-sm whitespace-normal break-words">
            {reporterNickname ? (
              <div>
                <div className="font-medium">{reporterNickname}</div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer underline"
                  title="클릭하여 복사"
                >
                  {reporterId.substring(0, 8)}...
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCopyId}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer underline"
                title="클릭하여 복사"
              >
                {reporterId.substring(0, 8)}...
              </button>
            )}
          </div>
        );
      },
    },
    {
      id: "reason",
      header: "사유",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="text-sm whitespace-nowrap min-w-[120px]">
            {getCategoryLabel(report.category)}
          </div>
        );
      },
    },
    {
      id: "description",
      header: "설명",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div className="text-sm text-muted-foreground whitespace-normal break-words min-w-[200px] max-w-md">
            {description || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                alert("TODO: 대상 확인 페이지로 이동");
              }}
            >
              대상 확인
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                alert("TODO: 신고자 확인 페이지로 이동");
              }}
            >
              신고자 확인
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "날짜",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string | null;
        if (!date) return <div>-</div>;
        return (
          <div>{format(parseISO(date), "yyyy. M. d.", { locale: ko })}</div>
        );
      },
    },
    {
      id: "manage",
      header: "관리",
      cell: ({ row }) => {
        const report = row.original;
        const isResolved = report.status === "resolved";
        return (
          <div className="flex items-center gap-2">
            {!isResolved && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleReject(report.id)}
                  disabled={updateReport.isPending}
                >
                  기각
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleResolve(report.id)}
                  disabled={updateReport.isPending}
                >
                  해결
                </Button>
              </>
            )}
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
          <h1 className="text-2xl font-bold">신고 관리</h1>
          <p className="text-muted-foreground text-sm">
            사용자 신고를 검토하고 처리합니다
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="신고자, 대상, 사유로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>상태:</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">대기</SelectItem>
              <SelectItem value="reviewed">검토중</SelectItem>
              <SelectItem value="resolved">해결</SelectItem>
              <SelectItem value="rejected">기각</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>타입:</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="user">사용자</SelectItem>
              <SelectItem value="community_post">게시글</SelectItem>
              <SelectItem value="gym">암장</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="clog-section rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">신고 목록 ({sortedData.length}개)</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert("TODO: 전체 선택 기능 구현");
            }}
          >
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
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const needsWrap = columnId === "description";
                    const needsNowrap = columnId === "reason";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          needsWrap
                            ? "whitespace-normal min-w-[200px]"
                            : needsNowrap
                              ? "whitespace-nowrap"
                              : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  신고가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}개의 신고
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

export default AdminReportsPage;
