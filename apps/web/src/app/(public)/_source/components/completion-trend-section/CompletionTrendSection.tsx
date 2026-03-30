"use client";

import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { openapi } from "#web/apis/openapi";

const CompletionTrendSection = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/stats/completion-week",
    undefined,
    { select: (d) => d.payload },
  );

  const chartData =
    data?.points.map((p) => ({
      ...p,
      label: format(parseISO(`${p.date}T12:00:00`), "M/d (EEE)", {
        locale: ko,
      }),
    })) ?? [];

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-on-surface">이번 주 완등 추이</h2>
        <p className="text-xs leading-relaxed text-on-surface-variant">
          세팅 주기에 맞춰 가장 많은 완등 기록이 올라오고 있어요. (시도 제외
          루트 기준)
        </p>
      </div>

      <div className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            style={{ outline: "none" }}
            tabIndex={-1}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(228,225,230,0.12)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#908fa0", fontSize: 10 }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={48}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tick={{ fill: "#908fa0", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1b1b1e",
                border: "1px solid rgba(228,225,230,0.15)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "#e4e1e6" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="완등"
              stroke="#c0c1ff"
              strokeWidth={2}
              dot={{ fill: "#c0c1ff", r: 3 }}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CompletionTrendSection;
