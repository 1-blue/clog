"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

interface IProps {
  recordUserId: string;
  recordId: string;
}

const RecordDetailEditEntry = ({ recordUserId, recordId }: IProps) => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  if (!me || me.id !== recordUserId) return null;

  return (
    <div className="flex justify-end">
      <Link
        href={ROUTES.RECORDS.DETAIL.EDIT.path(recordId)}
        className="flex size-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high/90 text-primary shadow-sm transition-colors hover:bg-surface-container-high"
        aria-label="기록 수정"
      >
        <Pencil className="size-5" strokeWidth={2} />
      </Link>
    </div>
  );
};

export default RecordDetailEditEntry;
