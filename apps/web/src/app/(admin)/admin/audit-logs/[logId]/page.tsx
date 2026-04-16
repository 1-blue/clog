import { notFound } from "next/navigation";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Card } from "#web/components/ui/card";

interface IProps {
  params: Promise<{ logId: string }>;
}

const AuditLogDetailPage = async ({ params }: IProps) => {
  const { logId } = await params;
  const log = await prisma.adminAuditLog.findUnique({
    where: { id: logId },
    include: {
      actor: { select: { id: true, nickname: true, email: true } },
    },
  });
  if (!log) notFound();

  return (
    <>
      <AdminPageHeader
        title="감사 로그 상세"
        description={`${log.action} · ${log.targetType}`}
      />
      <Card className="p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-on-surface-variant">시각</dt>
          <dd>{new Date(log.createdAt).toLocaleString("ko-KR")}</dd>
          <dt className="text-on-surface-variant">어드민</dt>
          <dd>
            {log.actor?.nickname} ({log.actor?.email})
          </dd>
          <dt className="text-on-surface-variant">액션</dt>
          <dd>{log.action}</dd>
          <dt className="text-on-surface-variant">대상 타입</dt>
          <dd>{log.targetType}</dd>
          <dt className="text-on-surface-variant">대상 ID</dt>
          <dd className="font-mono text-xs">{log.targetId}</dd>
          <dt className="text-on-surface-variant">라벨</dt>
          <dd>{log.targetLabel ?? "-"}</dd>
          <dt className="text-on-surface-variant">메모</dt>
          <dd>{log.note ?? "-"}</dd>
        </dl>
      </Card>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Before</h2>
          <pre className="max-h-[400px] overflow-auto rounded-md bg-surface-container p-3 text-xs whitespace-pre-wrap">
            {log.before ? JSON.stringify(log.before, null, 2) : "—"}
          </pre>
        </Card>
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">After</h2>
          <pre className="max-h-[400px] overflow-auto rounded-md bg-surface-container p-3 text-xs whitespace-pre-wrap">
            {log.after ? JSON.stringify(log.after, null, 2) : "—"}
          </pre>
        </Card>
      </div>
    </>
  );
};

export default AuditLogDetailPage;
