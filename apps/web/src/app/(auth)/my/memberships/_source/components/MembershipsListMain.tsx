"use client";

import { ChevronRight, Plus, Ticket } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import { buttonVariants } from "#web/components/ui/button-variants";
import { ROUTES } from "#web/constants";
import { gymMembershipBrandLabel } from "#web/libs/membership/brandLabels";
import { membershipPlanCodeLabel } from "#web/libs/membership/planLabels";
import { cn } from "#web/libs/utils";

type TUserMembership = components["schemas"]["UserMembership"];

const MembershipsListMain = () => {
  const { data: list = [] } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me/memberships",
    { params: { query: {} } },
    { select: (d) => d.payload ?? [] },
  );

  const rows = list as TUserMembership[];

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-10">
      <TopBar
        className="border-outline-variant bg-surface-container/80"
        showNotification={false}
        title="회원권"
      />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4">
        <Link
          href={ROUTES.MY.MEMBERSHIPS.NEW.path}
          className={buttonVariants({
            variant: "default",
            size: "lg",
            className: "h-12 w-full justify-center rounded-xl",
          })}
        >
          <Plus className="mr-2 size-5" />
          회원권 등록
        </Link>

        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low px-4 py-8 text-center text-sm text-on-surface-variant">
            등록된 회원권이 없어요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {rows.map((m) => (
              <li key={m.id}>
                <Link
                  href={ROUTES.MY.MEMBERSHIPS.DETAIL.path(m.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 transition-colors",
                    "hover:bg-surface-container active:scale-[0.99]",
                  )}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/60 text-primary">
                    <Ticket className="size-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-on-surface">
                      {m.gym.name}
                    </p>
                    <p className="truncate text-xs text-tertiary">
                      {gymMembershipBrandLabel(m.gym.membershipBrand)}
                    </p>
                    <p className="truncate text-sm text-on-surface-variant">
                      {membershipPlanCodeLabel(m.plan.code)}
                      {m.remainingUses != null
                        ? ` · 잔여 ${m.remainingUses}회`
                        : " · 무제한"}
                    </p>
                    <p className="mt-1 text-xs text-tertiary">
                      {m.isActive ? "이용 가능" : "만료·비활성"}
                    </p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-on-surface-variant" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MembershipsListMain;
