"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Pencil,
  Ticket,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import { Button } from "#web/components/ui/button";
import { ROUTES } from "#web/constants";
import useMembershipMutations from "#web/hooks/mutations/memberships/useMembershipMutations";
import { gymMembershipBrandLabel } from "#web/libs/membership/brandLabels";
import { membershipPlanCodeLabel } from "#web/libs/membership/planLabels";
import { cn } from "#web/libs/utils";

type TUserMembership = components["schemas"]["UserMembership"];
type TUsagePayload = components["schemas"]["UserMembershipUsagePayload"];

interface IProps {
  userMembershipId: string;
}

const MembershipDetailMain: React.FC<IProps> = ({ userMembershipId }) => {
  const router = useRouter();
  const { deleteMutation } = useMembershipMutations();

  const { data: m } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me/memberships/{userMembershipId}",
    { params: { path: { userMembershipId } } },
    { select: (d) => d.payload as TUserMembership },
  );

  const { data: usage } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me/memberships/{userMembershipId}/usage",
    { params: { path: { userMembershipId } } },
    { select: (d) => d.payload as TUsagePayload },
  );

  const { membership, stats, sessions } = usage;

  const onDelete = () => {
    if (
      !window.confirm(
        "이 회원권을 삭제할까요? 연결된 기록이 있으면 삭제되지 않을 수 있어요.",
      )
    ) {
      return;
    }
    deleteMutation.mutate(
      { params: { path: { userMembershipId } } },
      {
        onSuccess: () => {
          router.replace(ROUTES.MY.MEMBERSHIPS.path);
        },
      },
    );
  };

  const usageRate =
    stats.usageRatePercent != null ? Math.round(stats.usageRatePercent) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-10">
      <TopBar title={membership.gym.name} />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 pt-4">
        <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/60 text-primary">
              <Ticket className="size-6" strokeWidth={2} />
            </div>
            <div className="flex justify-end">
              <Link
                href={ROUTES.MY.MEMBERSHIPS.EDIT.path(userMembershipId)}
                className="flex size-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high/90 text-primary shadow-sm transition-colors hover:bg-surface-container-high"
                aria-label="회원권 수정"
              >
                <Pencil className="size-5" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="mt-4 min-w-0">
            <Link
              href={ROUTES.GYMS.DETAIL.path(m.gymId)}
              className="inline-flex items-center gap-1 text-lg font-bold text-on-surface hover:text-primary"
            >
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{m.gym.name}</span>
            </Link>
            <p className="mt-1 text-xs text-tertiary">
              {gymMembershipBrandLabel(m.gym.membershipBrand)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xl font-bold text-on-surface">
                {membershipPlanCodeLabel(m.plan.code)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  m.isActive
                    ? "bg-tertiary/20 text-tertiary"
                    : "bg-muted text-on-surface-variant",
                )}
              >
                {m.isActive ? "이용 가능" : "만료·비활성"}
              </span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-surface-container-high/80 p-3">
              <dt className="flex items-center gap-1 text-xs text-on-surface-variant">
                <Calendar className="size-3.5" />
                시작일
              </dt>
              <dd className="mt-1 font-semibold text-on-surface">
                {membership.startedDateYmd.replaceAll("-", ".")}
              </dd>
            </div>
            <div className="rounded-xl bg-surface-container-high/80 p-3">
              <dt className="text-xs text-on-surface-variant">만료일(참고)</dt>
              <dd className="mt-1 font-semibold text-on-surface">
                {membership.lastValidDateYmd.replaceAll("-", ".")}
              </dd>
            </div>
            <div className="rounded-xl bg-surface-container-high/80 p-3">
              <dt className="text-xs text-on-surface-variant">잔여 횟수</dt>
              <dd className="mt-1 font-semibold text-on-surface">
                {membership.remainingUses != null
                  ? `${membership.remainingUses}회`
                  : "무제한(정기)"}
              </dd>
            </div>
            <div className="rounded-xl bg-surface-container-high/80 p-3">
              <dt className="text-xs text-on-surface-variant">남은 기간</dt>
              <dd className="mt-1 font-semibold text-on-surface">
                {membership.remainingDays}일
              </dd>
            </div>
          </dl>

          {m.note ? (
            <p className="mt-4 rounded-xl bg-surface-container-high/80 p-3 text-sm text-on-surface-variant">
              {m.note}
            </p>
          ) : null}
        </section>

        {m.pauses.length > 0 ? (
          <section>
            <h2 className="mb-2 text-sm font-bold tracking-widest text-tertiary uppercase">
              일시정지
            </h2>
            <ul className="space-y-2">
              {m.pauses.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-outline-variant/25 bg-surface-container-low px-4 py-3 text-sm"
                >
                  {p.startDateYmd} ~ {p.endDateYmd}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-widest text-tertiary uppercase">
            <BarChart3 className="size-4" />
            사용 통계
          </h2>
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 rounded-xl bg-surface-container-high/60 p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-tertiary" />
                <div>
                  <p className="text-xs text-on-surface-variant">총 사용</p>
                  <p className="text-lg font-bold text-on-surface">
                    {stats.totalUsed}회
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-surface-container-high/60 p-3">
                <Calendar className="mt-0.5 size-4 shrink-0 text-tertiary" />
                <div>
                  <p className="text-xs text-on-surface-variant">주간 평균</p>
                  <p className="text-lg font-bold text-on-surface">
                    {stats.weeklyAverage}회
                  </p>
                </div>
              </div>
            </div>
            {usageRate != null ? (
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-on-surface-variant">
                  <span>사용률</span>
                  <span className="font-semibold text-tertiary">
                    {usageRate}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-tertiary transition-[width] duration-500"
                    style={{ width: `${Math.min(100, usageRate)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-on-surface-variant">
                정기권은 횟수 기준 사용률이 없어요.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center justify-between text-sm font-bold tracking-widest text-tertiary uppercase">
            <span>사용 기록</span>
            <span className="text-xs font-normal text-on-surface-variant">
              {sessions.length}건
            </span>
          </h2>
          {sessions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low px-4 py-8 text-center text-sm text-on-surface-variant">
              아직 이 회원권으로 남긴 기록이 없어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={ROUTES.RECORDS.DETAIL.path(s.id)}
                    className="flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 transition-colors hover:bg-surface-container-high/80"
                  >
                    {s.gymLogoImageUrl ? (
                      <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full bg-surface-container-high ring-1 ring-outline-variant/20">
                        <img
                          src={s.gymLogoImageUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      </span>
                    ) : (
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary/20 text-sm font-bold text-tertiary">
                        {s.routeCount}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-on-surface">
                        {format(new Date(s.date), "yyyy년 M월 d일 (EEE)", {
                          locale: ko,
                        })}
                      </p>
                      <p className="truncate text-xs text-on-surface-variant">
                        {s.gymName} · 문제 {s.routeCount}개
                      </p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-on-surface-variant" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            className="h-12 rounded-xl"
            disabled={deleteMutation.isPending}
            onClick={onDelete}
          >
            <Trash2 className="mr-2 size-4" />
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetailMain;
