"use client";

import { openapi } from "#web/apis/openapi";

import RecordEditForm from "../record-edit-form/RecordEditForm";

interface IProps {
  recordId: string;
}

/** useSuspenseQuery로 기록 데이터를 가져온 뒤 편집 폼 렌더 */
const RecordEditMain: React.FC<IProps> = ({ recordId }) => {
  const { data: record } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/records/{recordId}",
    { params: { path: { recordId } } },
    { select: (d) => d.payload },
  );

  if (!record) {
    return (
      <div className="flex h-60 items-center justify-center px-4">
        <p className="text-sm text-on-surface-variant">
          기록을 찾을 수 없습니다
        </p>
      </div>
    );
  }

  return <RecordEditForm key={record.id} recordId={recordId} record={record} />;
};

export default RecordEditMain;
