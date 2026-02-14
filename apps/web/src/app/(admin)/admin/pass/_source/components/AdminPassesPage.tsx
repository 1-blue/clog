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
  useSuspensePasses,
  useDeletePass,
} from "#/src/hooks/queries/use-passes";
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

type Pass = Database["public"]["Tables"]["passes"]["Row"] & {
  profiles?: { id: string; nickname: string } | null;
  gyms?: { id: string; name: string } | null;
};

// 타입 라벨 및 색상
const getTypeInfo = (type: string) => {
  const map: Record<string, { label: string; color: string }> = {
    count: { label: "횟수권", color: "bg-blue-100 text-blue-700" },
    period: { label: "기간권", color: "bg-green-100 text-green-700" },
    daily: { label: "1일권", color: "bg-purple-100 text-purple-700" },
  };
  return map[type] || { label: type, color: "bg-gray-100 text-gray-700" };
};

// 상태 라벨 및 색상
const getStatusInfo = (pass: Pass) => {
  const now = new Date();
  const endDate = pass.end_date ? parseISO(pass.end_date) : null;

  if (pass.type === "count") {
    const remaining = pass.remaining_count ?? 0;
    if (remaining === 0) {
      return { label: "사용완료", color: "bg-gray-100 text-gray-700" };
    }
    return { label: "활성", color: "bg-green-100 text-green-700" };
  }

  if (pass.type === "period" || pass.type === "daily") {
    if (!endDate) {
      return { label: "활성", color: "bg-green-100 text-green-700" };
    }
    if (endDate < now) {
      return { label: "만료", color: "bg-red-100 text-red-700" };
    }
    return { label: "활성", color: "bg-green-100 text-green-700" };
  }

  return { label: "활성", color: "bg-green-100 text-green-700" };
};

// 기간/횟수 표시
const getDurationDisplay = (pass: Pass) => {
  if (pass.type === "count") {
    return `${pass.remaining_count ?? 0} / ${pass.total_count ?? 0}`;
  }
  if (pass.type === "period" || pass.type === "daily") {
    const start = format(parseISO(pass.start_date), "yyyy. M. d.", {
      locale: ko,
    });
    const end = pass.end_date
      ? format(parseISO(pass.end_date), "yyyy. M. d.", { locale: ko })
      : "-";
    return `${start} ~ ${end}`;
  }
  return "-";
};

const AdminPassesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: passes } = useSuspensePasses();
  const deletePass = useDeletePass();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "latest"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!passes) return [];

    let filtered = passes;

    // 검색 필터 (사용자명, 암장명, 회원권명)
    if (searchQuery) {
      filtered = filtered.filter((pass) => {
        const userNickname =
          pass.profiles && typeof pass.profiles === "object" && "nickname" in pass.profiles
            ? (pass.profiles as { nickname: string }).nickname
            : "";
        const gymName =
          pass.gyms && typeof pass.gyms === "object" && "name" in pass.gyms
            ? (pass.gyms as { name: string }).name
            : "";
        const passName = pass.name || "";

        return (
          userNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          passName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // 타입 필터
    if (selectedType !== "all") {
      filtered = filtered.filter((pass) => pass.type === selectedType);
    }

    // 상태 필터
    if (selectedStatus !== "all") {
      filtered = filtered.filter((pass) => {
        const statusInfo = getStatusInfo(pass);
        if (selectedStatus === "active") {
          return statusInfo.label === "활성";
        }
        if (selectedStatus === "expired") {
          return statusInfo.label === "만료";
        }
        if (selectedStatus === "used") {
          return statusInfo.label === "사용완료";
        }
        return true;
      });
    }

    return filtered;
  }, [passes, searchQuery, selectedType, selectedStatus]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (selectedSort === "latest") {
      sorted.sort((a, b) => {
        const aDate = a.created_at
          ? parseISO(a.created_at).getTime()
          : 0;
        const bDate = b.created_at
          ? parseISO(b.created_at).getTime()
          : 0;
        return bDate - aDate;
      });
    } else if (selectedSort === "oldest") {
      sorted.sort((a, b) => {
        const aDate = a.created_at
          ? parseISO(a.created_at).getTime()
          : 0;
        const bDate = b.created_at
          ? parseISO(b.created_at).getTime()
          : 0;
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

  // 타입 필터 핸들러
  const handleTypeChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedType(newValue);
    updateUrl({ type: newValue, page: "1" });
  };

  // 상태 필터 핸들러
  const handleStatusChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedStatus(newValue);
    updateUrl({ status: newValue, page: "1" });
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
  const handleDelete = async (passId: string) => {
    if (!confirm("이 회원권을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePass.mutateAsync(passId);
    } catch (error) {
      console.error("Error deleting pass:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`회원권 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  // 컬럼 정의
  const columns: ColumnDef<Pass>[] = [
    {
      id: "user",
      header: "사용자",
      cell: ({ row }) => {
        const pass = row.original;
        const userNickname =
          pass.profiles && typeof pass.profiles === "object" && "nickname" in pass.profiles
            ? (pass.profiles as { nickname: string }).nickname
            : "알 수 없음";
        return (
          <Button
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={() => {
              // TODO: 사용자 상세 페이지로 이동
              console.log("View user:", pass.user_id);
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
        const pass = row.original;
        const gymName =
          pass.gyms && typeof pass.gyms === "object" && "name" in pass.gyms
            ? (pass.gyms as { name: string }).name
            : "알 수 없음";
        return (
          <Button
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={() => {
              // TODO: 암장 상세 페이지로 이동
              console.log("View gym:", pass.gym_id);
            }}
          >
            {gymName}
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: "회원권명",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "타입",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const typeInfo = getTypeInfo(type);
        return (
          <Badge variant="outline" className={cn(typeInfo.color)}>
            {typeInfo.label}
          </Badge>
        );
      },
    },
    {
      id: "duration_count",
      header: "기간/횟수",
      cell: ({ row }) => {
        const pass = row.original;
        return <div>{getDurationDisplay(pass)}</div>;
      },
    },
    {
      id: "status",
      header: "상태",
      cell: ({ row }) => {
        const pass = row.original;
        const statusInfo = getStatusInfo(pass);
        return (
          <Badge variant="outline" className={cn(statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "액션",
      cell: ({ row }) => {
        const pass = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                // TODO: 회원권 상세 페이지로 이동
                console.log("View pass:", pass.id);
              }}
            >
              상세
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDelete(pass.id)}
              disabled={deletePass.isPending}
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
          <h1 className="text-2xl font-bold">회원권 관리</h1>
          <p className="text-muted-foreground text-sm">
            모든 회원권과 이용권을 관리합니다
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="사용자명, 암장명, 회원권명으로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>타입:</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="count">횟수권</SelectItem>
              <SelectItem value="period">기간권</SelectItem>
              <SelectItem value="daily">1일권</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>상태:</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="expired">만료</SelectItem>
              <SelectItem value="used">사용완료</SelectItem>
            </SelectContent>
          </Select>
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
          <h2 className="font-semibold">회원권 목록 ({sortedData.length}개)</h2>
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
                  회원권이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}개의 회원권
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

export default AdminPassesPage;
