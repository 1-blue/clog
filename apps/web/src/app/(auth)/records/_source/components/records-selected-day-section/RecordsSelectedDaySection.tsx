"use client";

import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Mountain, Plus } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { components } from "#web/@types/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import { Badge } from "#web/components/ui/badge";
import { buttonVariants } from "#web/components/ui/button";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import {
  DATE_QUERY_KEY,
  getSelectedDateFromQuery,
  toLocalDate,
} from "../../utils/records-list-date";
import RecordDayCard from "./RecordDayCard";

type TRecordListItem = components["schemas"]["RecordListItem"];

interface IProps {
  records: TRecordListItem[];
}

const RecordsSelectedDaySection: React.FC<IProps> = ({ records }) => {
  const searchParams = useSearchParams();

  const selectedDate = useMemo(
    () => getSelectedDateFromQuery((k) => searchParams.get(k)),
    [searchParams],
  );

  const selectedDayRecords = useMemo(
    () => records.filter((r) => isSameDay(toLocalDate(r.date), selectedDate)),
    [records, selectedDate],
  );

  const totalRoutes = useMemo(
    () => selectedDayRecords.reduce((sum, r) => sum + r.routes.length, 0),
    [selectedDayRecords],
  );

  const newRecordHref = useMemo(() => {
    const ymd = format(selectedDate, "yyyy-MM-dd");
    const qs = new URLSearchParams({ [DATE_QUERY_KEY]: ymd });
    return `${ROUTES.RECORDS.NEW.path}?${qs.toString()}`;
  }, [selectedDate]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h2 className="min-w-0 flex-1 text-base font-semibold text-on-surface">
            {format(selectedDate, "M월 d일 (eee)의 기록", { locale: ko })}
          </h2>
          {selectedDayRecords.length > 0 ? (
            <Badge variant="secondary" className="shrink-0">
              총 {totalRoutes}개 루트
            </Badge>
          ) : null}
        </div>

        <Link
          href={newRecordHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 min-h-11 w-full justify-center gap-2 rounded-2xl border-primary/30 bg-surface-container-high/40 text-sm font-semibold text-on-surface shadow-none hover:border-primary/50 hover:bg-primary/10 hover:text-on-surface",
          )}
        >
          <Plus className="size-5" strokeWidth={2} aria-hidden />
          {format(selectedDate, "M월 d일", { locale: ko })} 기록 추가
        </Link>
      </div>

      {selectedDayRecords.length === 0 ? (
        <EmptyState
          icon={Mountain}
          title="이 날의 기록이 없습니다"
          description="클라이밍을 기록해 보세요."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {selectedDayRecords.map((record) => (
            <RecordDayCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecordsSelectedDaySection;
