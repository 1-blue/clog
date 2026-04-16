"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

type RecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  record: RecordDetail;
  className?: string;
}

const RecordDetailAuthorFooter = ({ record, className }: IProps) => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  if (me?.id === record.user.id) return null;

  return (
    <Link
      href={ROUTES.USERS.PROFILE.path(record.user.id)}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high/80",
        className,
      )}
    >
      <div className="size-11 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
        {record.user.profileImage ? (
          <img
            src={record.user.profileImage}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <UserRound
              className="size-5 text-on-surface-variant"
              strokeWidth={2}
            />
          </div>
        )}
      </div>
      <span className="font-semibold text-on-surface">
        {record.user.nickname}
      </span>
    </Link>
  );
};

export default RecordDetailAuthorFooter;
