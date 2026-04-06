"use client";

import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, ChevronDown, Link2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import FormHelper from "#web/components/shared/FormHelper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#web/components/ui/popover";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";
import {
  initialSessionMinutesFromCheckIn,
  recordDateToYmd,
} from "../../utils/sessionTimesFromRecord";

type TMyCheckInItem = components["schemas"]["MyCheckInItem"];

const NONE_DISPLAY_LABEL = "연결 안 함";

interface IProps {
  className?: string;
  /** 수정 폼: 이 세션에만 붙은 체크인을 목록에 포함 */
  forSessionId?: string;
}

/**
 * 체크인 구간 표시.
 * 같은 날이면 종료는 시각만(HH:mm)으로 짧게 표시.
 * 날짜가 바뀌면 시작·종료 모두 M/d HH:mm — 종료만 HH:mm이면 “당일 오전”으로 오해하기 쉬움(예: 4/4 20:42 – 11:16).
 */
const formatCheckInRange = (startedAt: string, endedAt: string) => {
  const s = parseISO(startedAt);
  const e = parseISO(endedAt);
  const dayS = format(s, "yyyy-MM-dd");
  const dayE = format(e, "yyyy-MM-dd");
  if (dayS === dayE) {
    return `${format(s, "M/d HH:mm", { locale: ko })} – ${format(e, "HH:mm")}`;
  }
  return `${format(s, "M/d HH:mm", { locale: ko })} – ${format(e, "M/d HH:mm", { locale: ko })}`;
};

const rowClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent";

const RecordCheckInLinkField: React.FC<IProps> = ({
  className,
  forSessionId,
}) => {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const gymCheckInId = useWatch({ control, name: "gymCheckInId" });
  const prevGymIdRef = useRef(gymId);

  useEffect(() => {
    if (prevGymIdRef.current !== gymId && gymCheckInId) {
      setValue("gymCheckInId", "", { shouldValidate: true });
    }
    prevGymIdRef.current = gymId;
  }, [gymId, gymCheckInId, setValue]);

  const {
    data: linkableRes = [],
    isFetched,
    isFetching,
  } = openapi.useQuery(
    "get",
    "/api/v1/users/me/check-ins",
    {
      params: {
        query: {
          linkableOnly: true,
          ...(forSessionId ? { forSessionId } : {}),
        },
      },
    },
    {
      select: (d) => d.payload?.items ?? [],
    },
  );

  /** 암장 미선택: 전체 연결 가능 체크인 / 선택 시: 해당 암장만 */
  const linkableForContext = useMemo(() => {
    const raw = linkableRes as TMyCheckInItem[];
    if (!gymId) return raw;
    return raw.filter((c) => c.gymId === gymId);
  }, [linkableRes, gymId]);

  const selectedItem = useMemo((): TMyCheckInItem | null => {
    if (!gymCheckInId) return null;
    return (
      (linkableRes as TMyCheckInItem[]).find((c) => c.id === gymCheckInId) ??
      null
    );
  }, [gymCheckInId, linkableRes]);

  const mergedLinkable = useMemo(() => {
    if (!selectedItem) return linkableForContext;
    if (linkableForContext.some((c) => c.id === selectedItem.id)) {
      return linkableForContext;
    }
    return [selectedItem, ...linkableForContext];
  }, [linkableForContext, selectedItem]);

  const emptyHint =
    !isFetched || isFetching
      ? ""
      : mergedLinkable.length === 0
        ? gymId
          ? "이 암장에서 연결 가능한 체크인이 없어요."
          : "연결 가능한 체크인이 없어요."
        : "";

  const triggerLines = useMemo(() => {
    if (!isFetched || isFetching) {
      return { title: "불러오는 중…", subtitle: "" as string };
    }
    if (!gymCheckInId) {
      return { title: NONE_DISPLAY_LABEL, subtitle: "" };
    }
    const item =
      mergedLinkable.find((c) => c.id === gymCheckInId) ??
      (selectedItem?.id === gymCheckInId ? selectedItem : null);
    if (!item) {
      return { title: "체크인 선택", subtitle: "" };
    }
    return {
      title: item.gymName,
      subtitle: item.endedAt
        ? formatCheckInRange(item.startedAt, item.endedAt)
        : "",
    };
  }, [isFetched, isFetching, gymCheckInId, mergedLinkable, selectedItem]);

  const applyCheckIn = (item: TMyCheckInItem) => {
    if (!item.endedAt) return;
    setValue("gymCheckInId", item.id, { shouldValidate: true });
    setValue("gymId", item.gymId, { shouldValidate: true });
    setValue("gymName", item.gymName, { shouldValidate: true });
    setValue("dateYmd", recordDateToYmd(item.startedAt), {
      shouldValidate: true,
    });
    const { startMinutes, endMinutes } = initialSessionMinutesFromCheckIn(
      item.startedAt,
      item.endedAt,
    );
    setValue("startMinutes", startMinutes, { shouldValidate: true });
    setValue("endMinutes", endMinutes, { shouldValidate: true });
  };

  const clearLink = () => {
    setValue("gymCheckInId", "", { shouldValidate: true });
  };

  const pickNone = () => {
    clearLink();
    setOpen(false);
  };

  const pickCheckIn = (item: TMyCheckInItem) => {
    applyCheckIn(item);
    setOpen(false);
  };

  const loading = !isFetched || isFetching;

  return (
    <FormHelper
      label="체크인과 연결"
      labelClassName={recordFormFieldLabelClass}
      className={cn("gap-2", className)}
      cloneChild={false}
      controlAriaLabel="체크인 연결 선택"
      description="체크아웃 후 30분 이상인 종료 체크인만 연결할 수 있어요."
    >
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={loading}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-high px-4 py-3.5 text-left transition-colors",
                "hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                "disabled:pointer-events-none disabled:opacity-60",
                !gymCheckInId && !loading && "text-on-surface-variant",
              )}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <Link2 className="size-5 text-primary" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span
                    className={cn(
                      "block leading-tight font-medium text-on-surface",
                      !gymCheckInId && !loading && "text-on-surface-variant",
                    )}
                  >
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
                className={cn(rowClass, !gymCheckInId && "bg-accent/50")}
                onClick={pickNone}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                  <Link2 className="size-4 text-tertiary" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-tight font-medium text-on-surface">
                    {NONE_DISPLAY_LABEL}
                  </span>
                </span>
                {!gymCheckInId ? (
                  <Check
                    className="size-4 shrink-0 self-center text-primary"
                    strokeWidth={2}
                  />
                ) : (
                  <span className="size-4 shrink-0 self-center" />
                )}
              </button>

              {mergedLinkable.map((item) => {
                const selected = gymCheckInId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(rowClass, selected && "bg-accent/50")}
                    onClick={() => pickCheckIn(item)}
                    disabled={!item.endedAt}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                      <Link2 className="size-4 text-tertiary" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block leading-tight font-medium text-on-surface">
                        {item.gymName}
                      </span>
                      {item.endedAt ? (
                        <span className="mt-0.5 block text-xs leading-snug text-on-surface-variant">
                          {formatCheckInRange(item.startedAt, item.endedAt)}
                        </span>
                      ) : null}
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
        {emptyHint && !loading ? (
          <p className="mt-2 text-xs text-on-surface-variant">{emptyHint}</p>
        ) : null}
      </>
    </FormHelper>
  );
};

export default RecordCheckInLinkField;
