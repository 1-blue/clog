"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { fetchClient } from "#web/apis/openapi";

import { getSelectedDateFromQuery } from "../../utils/records-list-date";
import RecordsCalendar from "../records-calendar/RecordsCalendar";
import RecordsSelectedDaySection from "../records-selected-day-section/RecordsSelectedDaySection";

const RecordsList: React.FC = () => {
  const searchParams = useSearchParams();

  const monthStr = useMemo(
    () =>
      format(
        getSelectedDateFromQuery((k) => searchParams.get(k)),
        "yyyy-MM",
      ),
    [searchParams],
  );

  const { data: records } = useSuspenseQuery({
    queryKey: ["get", "/api/v1/records", { month: monthStr }],
    queryFn: async () => {
      const { data: res } = await fetchClient.GET("/api/v1/records", {
        params: { query: { month: monthStr } },
      });
      return res!.payload.items;
    },
  });

  return (
    <div className="flex flex-col gap-8 pb-4">
      <RecordsCalendar records={records} />

      <RecordsSelectedDaySection records={records} />
    </div>
  );
};

export default RecordsList;
