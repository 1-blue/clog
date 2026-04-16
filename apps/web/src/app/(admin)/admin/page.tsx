import { subDays } from "date-fns";
import Link from "next/link";

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

const fetchDashboard = async () => {
  const now = new Date();
  const d1 = subDays(now, 1);

  const [
    userCount,
    gymCount,
    closedGymCount,
    recentErrorCount,
    activeCheckInCount,
    recentErrors,
    recentUsers,
    recentGyms,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.gym.count({ where: { isClosed: false } }),
    prisma.gym.count({ where: { isClosed: true } }),
    prisma.apiErrorLog.count({ where: { createdAt: { gte: d1 } } }),
    prisma.gymCheckIn.count({
      where: { endedAt: null, endsAt: { gt: now } },
    }),
    prisma.apiErrorLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        method: true,
        endpoint: true,
        httpStatus: true,
        errorName: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        nickname: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.gym.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, region: true, createdAt: true },
    }),
  ]);

  return {
    userCount,
    gymCount,
    closedGymCount,
    recentErrorCount,
    activeCheckInCount,
    recentErrors,
    recentUsers,
    recentGyms,
  };
};

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) => (
  <Card className="p-4">
    <div className="text-xs text-on-surface-variant">{label}</div>
    <div className="mt-1 text-2xl font-bold text-on-surface">{value}</div>
    {hint ? (
      <div className="mt-1 text-xs text-on-surface-variant">{hint}</div>
    ) : null}
  </Card>
);

const AdminDashboardPage = async () => {
  const data = await fetchDashboard();

  return (
    <>
      <AdminPageHeader
        title="대시보드"
        description="운영 지표 및 최근 활동 요약"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="총 유저" value={data.userCount} />
        <StatCard
          label="운영 중 암장"
          value={data.gymCount}
          hint={`폐업 ${data.closedGymCount}개`}
        />
        <StatCard label="최근 24h 에러" value={data.recentErrorCount} />
        <StatCard label="활성 체크인" value={data.activeCheckInCount} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-0">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-on-surface">
              최근 에러 로그
            </h2>
            <Link
              href="/admin/error-logs"
              className="text-xs text-primary hover:underline"
            >
              전체 보기
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시각</TableHead>
                <TableHead>메서드</TableHead>
                <TableHead>엔드포인트</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentErrors.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">
                    {new Date(log.createdAt).toLocaleString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-xs">{log.method}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs">
                    <Link
                      href={`/admin/error-logs/${log.id}`}
                      className="text-primary hover:underline"
                    >
                      {log.endpoint}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{log.httpStatus}</TableCell>
                </TableRow>
              ))}
              {data.recentErrors.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-xs text-on-surface-variant"
                  >
                    최근 에러가 없습니다.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-0">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-on-surface">
              최근 가입 유저
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>닉네임</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="text-xs">{u.nickname}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-xs">
                    {u.email}
                  </TableCell>
                  <TableCell className="text-xs">{u.role}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardPage;
