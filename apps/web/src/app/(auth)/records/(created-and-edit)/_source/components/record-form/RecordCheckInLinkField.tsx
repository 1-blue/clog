"use client";

import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Unlink } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import FormHelper from "#web/components/shared/FormHelper";
import { Button } from "#web/components/ui/button";
import SearchableCombobox from "#web/components/ui/searchable-combobox";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";
import {
  initialSessionMinutesFromCheckIn,
  recordDateToYmd,
} from "../../utils/sessionTimesFromRecord";

type TMyCheckInItem = components["schemas"]["MyCheckInItem"];

const NONE_VALUE = "__checkin_none__";

/** 목록용 “연결 안 함” 행 (API 스키마 형태 맞춤) */
const NONE_CHECKIN: TMyCheckInItem = {
  id: NONE_VALUE,
  gymId: "00000000-0000-0000-0000-000000000001",
  gymName: "",
  startedAt: "1970-01-01T00:00:00.000Z",
  endedAt: null,
};

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

const filterCheckInsByQuery = (
  items: TMyCheckInItem[],
  q: string,
): TMyCheckInItem[] => {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((c) => {
    if (c.id === NONE_VALUE) return true;
    const range =
      c.endedAt != null
        ? formatCheckInRange(c.startedAt, c.endedAt).toLowerCase()
        : "";
    return c.gymName.toLowerCase().includes(needle) || range.includes(needle);
  });
};

const RecordCheckInLinkField: React.FC<IProps> = ({
  className,
  forSessionId,
}) => {
  const { control, setValue } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const gymCheckInId = useWatch({ control, name: "gymCheckInId" });
  const prevGymIdRef = useRef(gymId);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      280,
    );
    return () => window.clearTimeout(id);
  }, [searchQuery]);

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
    const fromList = (linkableRes as TMyCheckInItem[]).find(
      (c) => c.id === gymCheckInId,
    );
    return fromList ?? null;
  }, [gymCheckInId, linkableRes]);

  const mergedLinkable = useMemo(() => {
    if (!selectedItem) return linkableForContext;
    if (linkableForContext.some((c) => c.id === selectedItem.id)) {
      return linkableForContext;
    }
    return [selectedItem, ...linkableForContext];
  }, [linkableForContext, selectedItem]);

  const trimmedInput = searchQuery.trim();
  const debounced = debouncedSearch.trim();
  const isPendingDebounce =
    trimmedInput.length >= 1 && trimmedInput !== debounced;

  const comboboxItems = useMemo(() => {
    const withNone = [NONE_CHECKIN, ...mergedLinkable];
    if (isPendingDebounce) return [];
    return filterCheckInsByQuery(withNone, debounced);
  }, [mergedLinkable, debounced, isPendingDebounce]);

  const applyCheckIn = (item: TMyCheckInItem) => {
    if (item.id === NONE_VALUE || !item.endedAt) return;
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

  const emptyContent = isPendingDebounce
    ? "검색 중…"
    : isFetching
      ? "불러오는 중…"
      : !isFetched
        ? "불러오는 중…"
        : mergedLinkable.length === 0
          ? gymId
            ? "이 암장에서 연결 가능한 체크인이 없어요."
            : "연결 가능한 체크인이 없어요."
          : "검색 결과가 없어요.";

  const valueForCombobox = selectedItem;

  return (
    <FormHelper
      label="체크인과 연결"
      labelClassName={recordFormFieldLabelClass}
      className={cn("gap-2", className)}
      cloneChild={false}
      controlAriaLabel="체크인 연결 검색"
      description="체크아웃 후 30분 이상인 종료 체크인만 연결할 수 있어요."
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <SearchableCombobox<TMyCheckInItem>
            items={comboboxItems}
            value={valueForCombobox}
            onValueChange={(next) => {
              if (!next || next.id === NONE_VALUE) {
                clearLink();
                return;
              }
              applyCheckIn(next);
            }}
            onInputValueChange={setSearchQuery}
            itemToStringLabel={(item) => {
              if (item.id === NONE_VALUE) return "연결 안 함";
              if (!item.endedAt) return item.gymName;
              return `${item.gymName} · ${formatCheckInRange(item.startedAt, item.endedAt)}`;
            }}
            getItemKey={(item) => item.id}
            isItemEqualToValue={(a, b) => a.id === b.id}
            renderItem={(item) =>
              item.id === NONE_VALUE ? (
                <span className="min-w-0 text-on-surface-variant">
                  연결 안 함
                </span>
              ) : (
                <span className="flex min-w-0 flex-col gap-0.5 text-left">
                  <span className="font-medium wrap-break-word">
                    {item.gymName}
                  </span>
                  {item.endedAt ? (
                    <span className="text-xs text-muted-foreground">
                      {formatCheckInRange(item.startedAt, item.endedAt)}
                    </span>
                  ) : null}
                </span>
              )
            }
            placeholder={gymId ? "체크인 검색" : "암장 선택 후 검색해주세요"}
            emptyContent={emptyContent}
          />
        </div>
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
    </FormHelper>
  );
};

export default RecordCheckInLinkField;
