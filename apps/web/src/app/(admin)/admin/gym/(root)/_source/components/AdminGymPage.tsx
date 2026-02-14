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
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  getCityLabel,
  getStatusLabel,
  getStatusColor,
} from "#/src/libs/mapping";
import { useSuspenseGyms, useDeleteGym } from "#/src/hooks/queries/use-gyms";
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

type Gym = Database["public"]["Tables"]["gyms"]["Row"];

const AdminGymPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: gyms } = useSuspenseGyms();
  const deleteGym = useDeleteGym();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("name") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!gyms) return [];

    let filtered = gyms;

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 지역 필터 (city enum 사용)
    if (selectedCity !== "all") {
      filtered = filtered.filter((gym) => gym.city === selectedCity);
    }

    // 상태 필터
    if (selectedStatus !== "all") {
      filtered = filtered.filter((gym) => gym.status === selectedStatus);
    }

    return filtered;
  }, [gyms, searchQuery, selectedCity, selectedStatus]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.length > 0) {
      const sort = sorting[0];
      sorted.sort((a, b) => {
        if (sort.id === "updated_at") {
          const aDate = a.updated_at ? parseISO(a.updated_at).getTime() : 0;
          const bDate = b.updated_at ? parseISO(b.updated_at).getTime() : 0;
          return sort.desc ? bDate - aDate : aDate - bDate;
        }
        if (sort.id === "review_count") {
          const aCount = a.review_count || 0;
          const bCount = b.review_count || 0;
          return sort.desc ? bCount - aCount : aCount - bCount;
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
    updateUrl({ name: value, page: "1" });
  };

  // 지역 필터 핸들러
  const handleCityChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedCity(newValue);
    updateUrl({ city: newValue, page: "1" });
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

  // 컬럼 정의
  const columns: ColumnDef<Gym>[] = [
    {
      accessorKey: "name",
      header: "암장명",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "city",
      header: "지역",
      cell: ({ row }) => {
        const gym = row.original;
        const cityLabel = getCityLabel(gym.city);
        const district = gym.district || "";
        const displayText = district ? `${cityLabel}(${district})` : cityLabel;
        return (
          <Badge variant="outline" className="bg-main-100 text-main-800">
            {displayText}
          </Badge>
        );
      },
    },
    {
      accessorKey: "address",
      header: "주소",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string | null;
        const colors = getStatusColor(status);
        return (
          <Badge variant="outline" className={cn(colors.bg, colors.text)}>
            {colors.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "review_count",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 hover:bg-transparent"
          >
            리뷰
            {sorted === "asc" ? (
              <ArrowUp className="ml-1 h-3 w-3" />
            ) : sorted === "desc" ? (
              <ArrowDown className="ml-1 h-3 w-3" />
            ) : (
              <ArrowUpDown className="text-muted-foreground ml-1 h-3 w-3" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const count = row.getValue("review_count") as number | null;
        return <div>{count || 0}개</div>;
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 hover:bg-transparent"
          >
            최종 수정
            {sorted === "asc" ? (
              <ArrowUp className="ml-1 h-3 w-3" />
            ) : sorted === "desc" ? (
              <ArrowDown className="ml-1 h-3 w-3" />
            ) : (
              <ArrowUpDown className="text-muted-foreground ml-1 h-3 w-3" />
            )}
          </Button>
        );
      },
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
        const gym = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={routes.admin.gym.edit.url(gym.id)}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => handleDelete(gym.id, gym.name)}
              disabled={deleteGym.isPending}
            >
              <Trash2 className="h-4 w-4" />
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

  // 고유 도시 목록 (enum 타입)
  const uniqueCities = useMemo(() => {
    if (!gyms) return [];
    const cities = Array.from(
      new Set(gyms.map((gym) => gym.city).filter(Boolean))
    ).sort() as Database["public"]["Enums"]["gym_city_enum"][];
    return cities;
  }, [gyms]);

  // 삭제 핸들러
  const handleDelete = async (gymId: string, gymName: string) => {
    if (!confirm(`"${gymName}" 암장을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteGym.mutateAsync(gymId);
      // 삭제 성공 시 onSuccess에서 invalidateQueries가 호출되어
      // useSuspenseGyms가 자동으로 refetch되고 목록이 갱신됩니다
    } catch (error) {
      console.error("Error deleting gym:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`암장 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">암장 관리</h1>
        </div>
        <Link href={routes.admin.gym.create.url}>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            암장 추가
          </Button>
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="암장명 또는 주소 검색"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>{getCityLabel(selectedCity)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {getCityLabel(city)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>{getStatusLabel(selectedStatus)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="pending">대기</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="rejected">거부</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
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
                  암장이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}개의 암장
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

export default AdminGymPage;
