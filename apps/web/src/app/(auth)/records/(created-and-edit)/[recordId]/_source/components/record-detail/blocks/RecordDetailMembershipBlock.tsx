"use client";

import { ChevronRight, Ticket } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { membershipPlanCodeLabel } from "#web/libs/membership/planLabels";
import { cn } from "#web/libs/utils";

type TRecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  record: TRecordDetail;
}

const cardClass = cn(
  "flex items-center gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-3.5",
);

const RecordDetailMembershipBlock: React.FC<IProps> = ({ record }) => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  if (me?.id !== record.user.id) return null;

  const m = record.userMembership;
  const hasLinked = Boolean(record.userMembershipId && m);

  if (hasLinked && m) {
    return (
      <Link
        href={ROUTES.MY.MEMBERSHIPS.DETAIL.path(m.id)}
        className={cn(
          cardClass,
          "transition-colors hover:border-primary/30 hover:bg-surface-container-high/80 active:scale-[0.99]",
        )}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/50 text-primary">
          <Ticket className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-on-surface-variant">
            연결된 회원권
          </p>
          <p className="truncate font-semibold text-on-surface">
            {membershipPlanCodeLabel(m.plan.code)}
          </p>
          <p className="truncate text-xs text-on-surface-variant">
            구매·등록 지점: {m.gym.name}
          </p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-on-surface-variant" />
      </Link>
    );
  }

  return (
    <div className={cn(cardClass, "cursor-default")}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant">
        <Ticket className="size-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-on-surface-variant">
          회원권을 연결하지 않은 기록
        </p>
        <p className="truncate font-semibold text-on-surface">일일 이용권</p>
      </div>
    </div>
  );
};

export default RecordDetailMembershipBlock;
