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
    <div className="flex justify-end px-4 pt-2">
      <Link
        href={ROUTES.RECORDS.DETAIL.EDIT.path(recordId)}
        className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-background/40 text-primary backdrop-blur-md transition-colors hover:bg-background/55"
        aria-label="기록 수정"
      >
        <Pencil className="size-5" strokeWidth={2} />
      </Link>
    </div>
  );
};

export default RecordDetailEditEntry;
