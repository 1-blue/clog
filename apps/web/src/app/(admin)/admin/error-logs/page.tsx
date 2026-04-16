import Link from "next/link";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Badge } from "#web/components/ui/badge";
import { Card } from "#web/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#web/components/ui/table";

interface IPageProps {
  searchParams: Promise<{
    method?: string;
    httpStatus?: string;
    endpoint?: string;
  }>;
}

const statusVariant = (status: number | null) => {
  if (status == null) return "outline" as const;
  if (status >= 500) return "destructive" as const;
  if (status >= 400) return "secondary" as const;
  return "outline" as const;
};

const ErrorLogsPage = async ({ searchParams }: IPageProps) => {
  const sp = await searchParams;
  const where = {
    ...(sp.method && { method: sp.method }),
    ...(sp.httpStatus && { httpStatus: Number(sp.httpStatus) }),
    ...(sp.endpoint && {
      endpoint: { contains: sp.endpoint, mode: "insensitive" as const },
    }),
  };
  const logs = await prisma.apiErrorLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <AdminPageHeader
        title="에러 로그"
        description="최근 100건. 상세 클릭 시 스택 확인"
      />

      <form className="mb-4 flex flex-wrap gap-2 text-sm">
        <input
          name="method"
          defaultValue={sp.method ?? ""}
          placeholder="메서드 (GET/POST...)"
          className="rounded-md border border-outline-variant bg-surface px-3 py-2"
        />
        <input
          name="httpStatus"
          defaultValue={sp.httpStatus ?? ""}
          placeholder="상태 코드"
          className="rounded-md border border-outline-variant bg-surface px-3 py-2"
        />
        <input
          name="endpoint"
          defaultValue={sp.endpoint ?? ""}
          placeholder="엔드포인트 검색"
          className="rounded-md border border-outline-variant bg-surface px-3 py-2"
        />
        <button
          type="submit"
          className="text-on-primary rounded-md bg-primary px-3 py-2"
        >
          검색
        </button>
      </form>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>시각</TableHead>
              <TableHead>메서드</TableHead>
              <TableHead>엔드포인트</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>에러명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("ko-KR")}
                </TableCell>
                <TableCell className="text-xs">{log.method}</TableCell>
                <TableCell className="max-w-[260px] truncate text-xs">
                  <Link
                    href={`/admin/error-logs/${log.id}`}
                    className="text-primary hover:underline"
                  >
                    {log.endpoint}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">
                  <Badge variant={statusVariant(log.httpStatus)}>
                    {log.httpStatus ?? "-"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[180px] truncate text-xs">
                  {log.errorName}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-on-surface-variant"
                >
                  에러 로그가 없습니다.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default ErrorLogsPage;
