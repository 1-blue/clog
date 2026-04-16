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

const AuditLogsPage = async () => {
  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: { select: { id: true, nickname: true, email: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="감사 로그"
        description="어드민이 수행한 모든 변경 이력"
      />
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>시각</TableHead>
              <TableHead>어드민</TableHead>
              <TableHead>액션</TableHead>
              <TableHead>대상</TableHead>
              <TableHead>라벨</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("ko-KR")}
                </TableCell>
                <TableCell className="text-xs">
                  {log.actor?.nickname ?? log.actorId.slice(0, 8)}
                </TableCell>
                <TableCell className="text-xs">
                  <Badge variant="secondary">{log.action}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  <Link
                    href={`/admin/audit-logs/${log.id}`}
                    className="text-primary hover:underline"
                  >
                    {log.targetType}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[260px] truncate text-xs">
                  {log.targetLabel ?? log.targetId}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-on-surface-variant"
                >
                  감사 로그가 없습니다.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default AuditLogsPage;
