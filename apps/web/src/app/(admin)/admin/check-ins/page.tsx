import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Card } from "#web/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#web/components/ui/table";

const CheckInsPage = async () => {
  const now = new Date();
  const checkIns = await prisma.gymCheckIn.findMany({
    where: {
      endedAt: null,
      endsAt: { gt: now },
    },
    orderBy: { startedAt: "desc" },
    take: 200,
    select: {
      id: true,
      startedAt: true,
      endsAt: true,
      user: { select: { id: true, nickname: true } },
      gym: { select: { id: true, name: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="활성 체크인"
        description={`현재 체크인 중인 유저 ${checkIns.length}명`}
      />
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>암장</TableHead>
              <TableHead>유저</TableHead>
              <TableHead>시작</TableHead>
              <TableHead>자동 종료</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkIns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-xs">{c.gym.name}</TableCell>
                <TableCell className="text-xs">{c.user.nickname}</TableCell>
                <TableCell className="text-xs">
                  {new Date(c.startedAt).toLocaleString("ko-KR")}
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(c.endsAt).toLocaleString("ko-KR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default CheckInsPage;
