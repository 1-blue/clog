import { notFound } from "next/navigation";

import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Card } from "#web/components/ui/card";

interface IProps {
  params: Promise<{ logId: string }>;
}

const ErrorLogDetailPage = async ({ params }: IProps) => {
  const { logId } = await params;
  const log = await prisma.apiErrorLog.findUnique({ where: { id: logId } });
  if (!log) notFound();

  return (
    <>
      <AdminPageHeader
        title="에러 로그 상세"
        description={`${log.method} ${log.endpoint}`}
      />
      <Card className="p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-on-surface-variant">시각</dt>
          <dd>{new Date(log.createdAt).toLocaleString("ko-KR")}</dd>
          <dt className="text-on-surface-variant">상태</dt>
          <dd>{log.httpStatus}</dd>
          <dt className="text-on-surface-variant">에러명</dt>
          <dd>{log.errorName}</dd>
          <dt className="text-on-surface-variant">Trace ID</dt>
          <dd className="font-mono text-xs">{log.traceId ?? "-"}</dd>
          <dt className="text-on-surface-variant">유저 ID</dt>
          <dd className="font-mono text-xs">{log.userId ?? "-"}</dd>
          <dt className="text-on-surface-variant">클라이언트 메시지</dt>
          <dd>{log.clientMessage ?? "-"}</dd>
        </dl>
      </Card>
      <Card className="mt-4 p-4">
        <h2 className="mb-2 text-sm font-semibold text-on-surface">
          에러 상세
        </h2>
        <pre className="max-h-[600px] overflow-auto rounded-md bg-surface-container p-3 text-xs whitespace-pre-wrap">
          {typeof log.errorLog === "string"
            ? log.errorLog
            : JSON.stringify(log.errorLog, null, 2)}
        </pre>
      </Card>
    </>
  );
};

export default ErrorLogDetailPage;
