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

interface IProps {
  searchParams: Promise<{ q?: string; role?: string }>;
}

const UsersPage = async ({ searchParams }: IProps) => {
  const sp = await searchParams;
  const users = await prisma.user.findMany({
    where: {
      ...(sp.role && { role: sp.role as "ADMIN" | "MANAGER" | "GUEST" }),
      ...(sp.q && {
        OR: [
          { nickname: { contains: sp.q, mode: "insensitive" as const } },
          { email: { contains: sp.q, mode: "insensitive" as const } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <>
      <AdminPageHeader title="유저 관리" />
      <form className="mb-4 flex gap-2 text-sm">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="닉네임·이메일 검색"
          className="rounded-md border border-outline-variant bg-surface px-3 py-2"
        />
        <select
          name="role"
          defaultValue={sp.role ?? ""}
          className="rounded-md border border-outline-variant bg-surface px-3 py-2"
        >
          <option value="">전체 권한</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="GUEST">GUEST</option>
        </select>
      </form>

      <Card className="p-0">
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
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-primary hover:underline"
                  >
                    {u.nickname}
                  </Link>
                </TableCell>
                <TableCell className="text-xs">{u.email}</TableCell>
                <TableCell className="text-xs">
                  <Badge variant={u.role === "ADMIN" ? "default" : "outline"}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default UsersPage;
