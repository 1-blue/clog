import { Plus } from "lucide-react";
import Link from "next/link";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Badge } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import { Card } from "#web/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#web/components/ui/table";

interface IProps {
  searchParams: Promise<{ status?: "all" | "active" | "closed"; q?: string }>;
}

const GymsPage = async ({ searchParams }: IProps) => {
  const sp = await searchParams;
  const status = sp.status ?? "active";
  const gyms = await prisma.gym.findMany({
    where: {
      ...(status === "active" && { isClosed: false }),
      ...(status === "closed" && { isClosed: true }),
      ...(sp.q && {
        OR: [
          { name: { contains: sp.q, mode: "insensitive" as const } },
          { address: { contains: sp.q, mode: "insensitive" as const } },
        ],
      }),
    },
    orderBy: [{ isClosed: "asc" }, { name: "asc" }],
    take: 200,
  });

  const filterLink = (s: "all" | "active" | "closed", label: string) => (
    <Link
      key={s}
      href={{ pathname: "/admin/gyms", query: { status: s, q: sp.q } }}
      className={`rounded-md px-3 py-1.5 text-sm ${
        status === s
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container text-on-surface"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <AdminPageHeader
        title="암장 관리"
        description="운영 중 · 폐업 암장 조회 및 수정"
        actions={
          <Link href="/admin/gyms/new">
            <Button size="sm">
              <Plus className="size-4" /> 암장 추가
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filterLink("active", "운영 중")}
        {filterLink("closed", "폐업")}
        {filterLink("all", "전체")}
        <form className="ml-auto">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="이름·주소 검색"
            className="rounded-md border border-outline-variant bg-surface px-3 py-1.5 text-sm"
          />
          <input type="hidden" name="status" value={status} />
        </form>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>지역</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>리뷰</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gyms.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Link
                    href={`/admin/gyms/${g.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {g.name}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">{g.region}</TableCell>
                <TableCell className="max-w-[280px] truncate text-xs">
                  {g.address}
                </TableCell>
                <TableCell className="text-xs">
                  {g.reviewCount} · ★ {g.avgRating.toFixed(1)}
                </TableCell>
                <TableCell className="text-xs">
                  {g.isClosed ? (
                    <Badge variant="destructive">폐업</Badge>
                  ) : (
                    <Badge variant="outline">운영</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {gyms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-on-surface-variant"
                >
                  암장이 없습니다.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default GymsPage;
