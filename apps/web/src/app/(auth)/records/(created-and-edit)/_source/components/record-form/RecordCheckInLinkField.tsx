"use client";

import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Link2, Unlink } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#web/components/ui/select";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";
import {
  initialSessionMinutesFromCheckIn,
  recordDateToYmd,
} from "../../utils/sessionTimesFromRecord";

type TMyCheckInItem = components["schemas"]["MyCheckInItem"];

const NONE_VALUE = "__checkin_none__";

interface IProps {
  className?: string;
  /** 수정 폼: 이 세션에만 붙은 체크인을 목록에 포함 */
  forSessionId?: string;
}

const formatCheckInRange = (startedAt: string, endedAt: string) => {
  const s = parseISO(startedAt);
  const e = parseISO(endedAt);
  return `${format(s, "M/d HH:mm", { locale: ko })} – ${format(e, "HH:mm")}`;
};

const RecordCheckInLinkField: React.FC<IProps> = ({
  className,
  forSessionId,
}) => {
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

  const { data: linkableRes = [], isFetched } = openapi.useQuery(
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
      enabled: Boolean(gymId),
      select: (d) => d.payload?.items ?? [],
    },
  );

  const linkableForGym = useMemo(
    () => (linkableRes as TMyCheckInItem[]).filter((c) => c.gymId === gymId),
    [linkableRes, gymId],
  );

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

  const selectValue = gymCheckInId || NONE_VALUE;

  const handleSelectChange = (value: string | null) => {
    if (value === NONE_VALUE) {
      clearLink();
      return;
    }
    if (!value) return;
    const item = linkableForGym.find((c) => c.id === value);
    if (item) applyCheckIn(item);
  };

  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <span className={recordFormFieldLabelClass}>체크인과 연결</span>
      <p className="text-xs text-on-surface-variant">
        체크아웃 후 30분 이상인 종료 체크인만 연결할 수 있어요. 이미 다른 기록에
        붙은 체크인은 목록에 나오지 않아요. 연결 시 방문일·시간이 맞춰져요.
      </p>

      {!gymId ? (
        <p className="text-xs text-on-surface-variant">
          암장을 먼저 선택해 주세요.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectValue} onValueChange={handleSelectChange}>
            <SelectTrigger
              className={cn(
                "h-auto min-h-11 w-full min-w-0 flex-1 rounded-2xl border-outline-variant/40 bg-surface-container py-2.5 pr-3 pl-3 text-left text-on-surface",
                !gymCheckInId && "text-on-surface-variant",
              )}
            >
              <Link2
                className="mr-2 size-4 shrink-0 text-primary"
                strokeWidth={2}
                aria-hidden
              />
              <SelectValue
                placeholder={
                  isFetched && linkableForGym.length === 0
                    ? "연결 가능한 체크인이 없어요"
                    : "체크인 선택"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border-outline-variant bg-popover">
              <SelectItem value={NONE_VALUE}>연결 안 함</SelectItem>
              {linkableForGym.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <span className="flex flex-col gap-0.5 text-left">
                    <span className="font-medium">{item.gymName}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.endedAt
                        ? formatCheckInRange(item.startedAt, item.endedAt)
                        : ""}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {gymCheckInId ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1"
              onClick={clearLink}
            >
              <Unlink className="size-3.5" strokeWidth={2} />
              연결 해제
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default RecordCheckInLinkField;
