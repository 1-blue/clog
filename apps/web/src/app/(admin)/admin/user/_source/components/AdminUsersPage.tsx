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
import { ArrowLeft, Eye, Ban, CheckCircle, Search } from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspenseUsers,
  useSuspenseUserStats,
  useDeleteUser,
} from "#/src/hooks/queries/use-users";
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

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  session_count: number;
};

const AdminUsersPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: users } = useSuspenseUsers();
  const { data: stats } = useSuspenseUserStats();
  const deleteUser = useDeleteUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!users) return [];

    let filtered = users;

    // 검색 필터 (닉네임)
    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 상태 필터 (일단 전체만, 나중에 정지 기능 추가 시 확장)
    // if (selectedStatus !== "all") {
    //   filtered = filtered.filter((user) => user.status === selectedStatus);
    // }

    return filtered;
  }, [users, searchQuery, selectedStatus]);

  // 정렬된 데이터
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
        if (sort.id === "session_count") {
          return sort.desc
            ? b.session_count - a.session_count
            : a.session_count - b.session_count;
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

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 삭제 핸들러
  const handleDelete = async (userId: string, nickname: string) => {
    if (!confirm(`"${nickname}" 사용자를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteUser.mutateAsync(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`사용자 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  // 컬럼 정의
  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: "nickname",
      header: "사용자",
      cell: ({ row }) => {
        const user = row.original;
        const initial = user.nickname.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium">{initial}</span>
            </div>
            <span className="font-medium">{user.nickname}</span>
          </div>
        );
      },
    },
    {
      id: "email",
      header: "이메일",
      cell: () => <div className="text-muted-foreground">-</div>, // 나중에 auth.users에서 가져오기
    },
    {
      accessorKey: "region",
      header: "지역",
      cell: ({ row }) => {
        const region = row.getValue("region") as string | null;
        if (!region) return <div>-</div>;
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {region}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "가입일",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string | null;
        if (!date) return <div>-</div>;
        return (
          <div>{format(parseISO(date), "yyyy.MM.dd", { locale: ko })}</div>
        );
      },
    },
    {
      accessorKey: "session_count",
      header: "세션",
      cell: ({ row }) => {
        const count = row.getValue("session_count") as number;
        return <div>{count}회</div>;
      },
    },
    {
      id: "status",
      header: "상태",
      cell: () => {
        // 일단 모두 활성으로 표시, 나중에 정지 기능 추가
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            활성
          </Badge>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "최근 활동",
      cell: ({ row }) => {
        const date = row.getValue("updated_at") as string | null;
        if (!date) return <div>-</div>;
        return (
          <div>{format(parseISO(date), "yyyy.MM.dd", { locale: ko })}</div>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                // TODO: 사용자 상세 페이지로 이동
                console.log("View user:", user.id);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => handleDelete(user.id, user.nickname)}
              disabled={deleteUser.isPending}
            >
              <Ban className="h-4 w-4" />
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
        <h1 className="text-2xl font-bold">사용자 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="clog-section">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-500">전체 사용자</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-500">활성 사용자</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold text-red-600">
            {stats.suspended}
          </div>
          <div className="text-sm text-gray-500">정지된 사용자</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold">{stats.thisWeek}</div>
          <div className="text-sm text-gray-500">이번 주 신규</div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="닉네임 또는 이메일 검색"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>전체 상태</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="suspended">정지</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  사용자가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}명의 사용자
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

export default AdminUsersPage;
