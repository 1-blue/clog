"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import * as React from "react";

import type { components } from "#web/@types/openapi";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "#web/components/ui/chart";

type TPayload = components["schemas"]["MeStatisticsPayload"];

const chartConfig = {
  sends: {
    label: "완등",
    color: "var(--primary)",
  },
} satisfies Record<string, { label: string; color: string }>;

interface IProps {
  data: TPayload;
}

const ActivityTrendSection: React.FC<IProps> = ({ data }) => {
  const gradId = React.useId().replace(/:/g, "");
  const { trend } = data;
  const chartData = trend.buckets.map((b) => ({
    label: b.label,
    sends: b.sends,
    key: b.key,
  }));

  const peakLabel =
    trend.peakBucketKey &&
    trend.buckets.find((b) => b.key === trend.peakBucketKey)?.label;

  return (
    <section className="space-y-4">
      <h2 className="px-1 text-lg font-semibold tracking-tight text-on-surface">
        활동 추세
      </h2>
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <ChartContainer
          config={chartConfig}
          className="relative aspect-[21/9] max-h-52 w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ left: 4, right: 4, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--outline-variant)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--on-surface-variant)", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              name="sends"
              dataKey="sends"
              type="monotone"
              fill={`url(#${gradId})`}
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        {trend.peakBucketKey && peakLabel && (
          <div className="mt-2 flex justify-center">
            <span className="rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1 text-[10px] font-medium text-primary">
              {peakLabel} · 완등
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityTrendSection;
