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
import { ArrowLeft, Eye, Trash2, Search } from "lucide-react";
import type { Database } from "@clog/db";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useSuspenseCommunityPosts,
  useSuspenseCommunityPostStats,
  useDeleteCommunityPost,
} from "#/src/hooks/queries/use-community-posts";
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

type CommunityPost = Database["public"]["Tables"]["community_posts"]["Row"];

// 카테고리 라벨 매핑
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    question: "질문",
    tip: "팁",
    crew: "크루모집",
  };
  return map[category] || category;
};

// 카테고리 색상 매핑
const getCategoryColor = (category: string) => {
  const map: Record<string, string> = {
    question: "bg-blue-100 text-blue-700",
    tip: "bg-purple-100 text-purple-700",
    crew: "bg-green-100 text-green-700",
  };
  return map[category] || "bg-gray-100 text-gray-700";
};

// 상태 라벨 및 색상
const getStatusInfo = (isReported: boolean | null) => {
  if (isReported) {
    return {
      label: "신고됨",
      color: "bg-red-100 text-red-700",
    };
  }
  return {
    label: "활성",
    color: "bg-green-100 text-green-700",
  };
};

const AdminCommunitiesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: posts } = useSuspenseCommunityPosts();
  const { data: stats } = useSuspenseCommunityPostStats();
  const deletePost = useDeleteCommunityPost();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all"
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  // 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    if (!posts) return [];

    let filtered = posts;

    // 검색 필터 (제목)
    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // 상태 필터
    if (selectedStatus !== "all") {
      if (selectedStatus === "reported") {
        filtered = filtered.filter((post) => post.is_reported === true);
      } else if (selectedStatus === "active") {
        filtered = filtered.filter((post) => post.is_reported !== true);
      }
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedStatus]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.length > 0) {
      const sort = sorting[0];
      sorted.sort((a, b) => {
        if (sort.id === "created_at" || sort.id === "updated_at") {
          const aDate = a[sort.id as "created_at" | "updated_at"]
            ? parseISO(a[sort.id as "created_at" | "updated_at"]!).getTime()
            : 0;
          const bDate = b[sort.id as "created_at" | "updated_at"]
            ? parseISO(b[sort.id as "created_at" | "updated_at"]!).getTime()
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

  // 카테고리 필터 핸들러
  const handleCategoryChange = (value: string | null) => {
    const newValue = value || "all";
    setSelectedCategory(newValue);
    updateUrl({ category: newValue, page: "1" });
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
  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePost.mutateAsync(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      alert(`게시글 삭제에 실패했습니다: ${errorMessage}`);
    }
  };

  // 컬럼 정의
  const columns: ColumnDef<CommunityPost>[] = [
    {
      accessorKey: "title",
      header: "제목",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      id: "author",
      header: "작성자",
      cell: () => <div className="text-muted-foreground">-</div>, // 나중에 user_id로 조회
    },
    {
      accessorKey: "category",
      header: "카테고리",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge
            variant="outline"
            className={cn(getCategoryColor(category))}
          >
            {getCategoryLabel(category)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "작성일",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string | null;
        if (!date) return <div>-</div>;
        return (
          <div>{format(parseISO(date), "yyyy.MM.dd", { locale: ko })}</div>
        );
      },
    },
    {
      id: "views_comments",
      header: "조회/댓글",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div>
            {post.comment_count || 0} / {post.comment_count || 0}
          </div>
        );
      },
    },
    {
      id: "reports",
      header: "신고",
      cell: ({ row }) => {
        const post = row.original;
        if (post.is_reported) {
          return <div className="text-red-600">신고됨</div>;
        }
        return <div className="text-muted-foreground">없음</div>;
      },
    },
    {
      id: "status",
      header: "상태",
      cell: ({ row }) => {
        const post = row.original;
        const statusInfo = getStatusInfo(post.is_reported);
        return (
          <Badge variant="outline" className={cn(statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "관리",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                alert("TODO: 게시글 상세 페이지로 이동");
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => handleDelete(post.id, post.title)}
              disabled={deletePost.isPending}
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
        <h1 className="text-2xl font-bold">커뮤니티 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="clog-section">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-500">전체 게시글</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          <div className="text-sm text-gray-500">오늘 작성</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold text-red-600">
            {stats.reported}
          </div>
          <div className="text-sm text-gray-500">신고된 게시글</div>
        </div>
        <div className="clog-section">
          <div className="text-2xl font-bold">{stats.deleted}</div>
          <div className="text-sm text-gray-500">삭제된 게시글</div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="clog-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="제목 또는 작성자 검색"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>전체 카테고리</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="question">질문</SelectItem>
              <SelectItem value="tip">팁</SelectItem>
              <SelectItem value="crew">크루모집</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue>전체 상태</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="reported">신고됨</SelectItem>
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
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          총 {sortedData.length}개의 게시글
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

export default AdminCommunitiesPage;
