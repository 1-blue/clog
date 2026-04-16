"use client";

import { Check, ChevronDown, Ticket } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#web/components/ui/popover";
import { gymMembershipBrandLabel } from "#web/libs/membership/brandLabels";
import { membershipPlanCodeLabel } from "#web/libs/membership/planLabels";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

type TUserMembership = components["schemas"]["UserMembership"];

interface IProps {
  className?: string;
  /** 수정 폼: 서버에서 내려온 기존 연결 ID (비활성 회원권도 선택지에 남김) */
  initialUserMembershipId?: string | null;
}

/** 둘째 줄: 암장명 · 요금제 · 잔여 (브랜드명 중복 제거) */
const membershipDetailLine = (m: TUserMembership) => {
  const planLabel = membershipPlanCodeLabel(m.plan.code);
  const usePart =
    m.remainingUses != null ? ` · 잔여 ${m.remainingUses}회` : " · 무제한";
  const inactive = m.isActive ? "" : " · 만료·비활성";
  return `${m.gym.name} · ${planLabel}${usePart}${inactive}`;
};

const RecordMembershipField: React.FC<IProps> = ({
  className,
  initialUserMembershipId,
}) => {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const userMembershipId = useWatch({ control, name: "userMembershipId" });

  const { data: sessionGym } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId: gymId ?? "" } } },
    {
      enabled: Boolean(gymId),
      select: (d) => d.payload,
    },
  );

  const { data: rawList = [], isFetched } = openapi.useQuery(
    "get",
    "/api/v1/users/me/memberships",
    {
      params: {
        query: {
          ...(gymId ? { gymId } : {}),
        },
      },
    },
    {
      enabled: Boolean(gymId),
      select: (d) => d.payload ?? [],
    },
  );

  const memberships = useMemo(() => {
    const list = (rawList as TUserMembership[]).filter(
      (m) => m.plan.code !== "COUNT_DAY",
    );
    return list.filter(
      (m) =>
        m.isActive ||
        m.id === initialUserMembershipId ||
        m.id === userMembershipId,
    );
  }, [rawList, initialUserMembershipId, userMembershipId]);

  const triggerLines = useMemo(() => {
    if (!userMembershipId) {
      if (sessionGym) {
        return {
          title: gymMembershipBrandLabel(sessionGym.membershipBrand),
          subtitle: `${sessionGym.name} · 일일 이용`,
        };
      }
      return { title: "일일 이용", subtitle: "" };
    }
    const m = memberships.find((x) => x.id === userMembershipId);
    if (!m) return { title: "회원권 선택", subtitle: "" };
    return {
      title: gymMembershipBrandLabel(m.gym.membershipBrand),
      subtitle: membershipDetailLine(m),
    };
  }, [userMembershipId, memberships, sessionGym]);

  const defaultAppliedForGymRef = useRef<string | null>(null);

  useEffect(() => {
    if (!gymId) {
      setValue("userMembershipId", "");
      defaultAppliedForGymRef.current = null;
      return;
    }
    if (!isFetched) return;

    if (defaultAppliedForGymRef.current === gymId) return;

    if (initialUserMembershipId) {
      setValue("userMembershipId", initialUserMembershipId, {
        shouldDirty: false,
      });
      defaultAppliedForGymRef.current = gymId;
      return;
    }

    const eligible = (rawList as TUserMembership[]).filter(
      (m) => m.plan.code !== "COUNT_DAY",
    );
    const atPurchaseGym = eligible.find((m) => m.gymId === gymId && m.isActive);
    setValue("userMembershipId", atPurchaseGym?.id ?? "", {
      shouldDirty: false,
    });
    defaultAppliedForGymRef.current = gymId;
  }, [gymId, rawList, initialUserMembershipId, isFetched, setValue]);

  if (!gymId) return null;

  const pickDaily = () => {
    setValue("userMembershipId", "", { shouldDirty: true });
    setOpen(false);
  };

  const pickMembership = (id: string) => {
    setValue("userMembershipId", id, { shouldDirty: true });
    setOpen(false);
  };

  const rowClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent";

  const dailyTitle = sessionGym
    ? gymMembershipBrandLabel(sessionGym.membershipBrand)
    : "일일 이용";
  const dailySubtitle = sessionGym ? `${sessionGym.name} · 일일 이용` : "";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn(recordFormFieldLabelClass, "flex items-center gap-2")}>
        <Ticket className="size-4 text-tertiary" strokeWidth={2} />
        회원권 (선택)
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-high px-4 py-3.5 text-left transition-colors",
              "hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            )}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Ticket className="size-5 text-primary" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block leading-tight font-medium text-on-surface">
                  {triggerLines.title}
                </span>
                {triggerLines.subtitle ? (
                  <span className="mt-0.5 block text-xs leading-snug text-on-surface-variant">
                    {triggerLines.subtitle}
                  </span>
                ) : null}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "size-5 shrink-0 self-center text-on-surface-variant transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="max-h-[min(24rem,70dvh)] w-[min(calc(100vw-2rem),28rem)] overflow-y-auto p-1"
        >
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              className={cn(rowClass, !userMembershipId && "bg-accent/50")}
              onClick={pickDaily}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                <Ticket className="size-4 text-tertiary" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block leading-tight font-medium text-on-surface">
                  {dailyTitle}
                </span>
                {dailySubtitle ? (
                  <span className="mt-0.5 block text-xs leading-snug text-on-surface-variant">
                    {dailySubtitle}
                  </span>
                ) : null}
              </span>
              {!userMembershipId ? (
                <Check
                  className="size-4 shrink-0 self-center text-primary"
                  strokeWidth={2}
                />
              ) : (
                <span className="size-4 shrink-0 self-center" />
              )}
            </button>

            {memberships.map((m) => {
              const selected = userMembershipId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={cn(rowClass, selected && "bg-accent/50")}
                  onClick={() => pickMembership(m.id)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                    <Ticket className="size-4 text-tertiary" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block leading-tight font-medium text-on-surface">
                      {gymMembershipBrandLabel(m.gym.membershipBrand)}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-on-surface-variant">
                      {membershipDetailLine(m)}
                    </span>
                  </span>
                  {selected ? (
                    <Check
                      className="size-4 shrink-0 self-center text-primary"
                      strokeWidth={2}
                    />
                  ) : (
                    <span className="size-4 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {memberships.length === 0 ? (
        <p className="text-xs text-on-surface-variant">
          이 브랜드에 등록된 회원권(일일권 제외)이 없어요. 마이페이지에서 먼저
          등록하거나, 위에서 일일 이용권으로 기록할 수 있어요.
        </p>
      ) : null}
    </div>
  );
};

export default RecordMembershipField;
