"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { components } from "#web/@types/openapi";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "#web/components/ui/chart";

type TRow = components["schemas"]["MeStatisticsPayload"]["difficultyDistribution"][number];

const chartConfig = {
  count: {
    label: "루트 수",
    color: "var(--primary)",
  },
} satisfies Record<string, { label: string; color: string }>;

/** V0~V10 전부 표시 + 좁은 뷰에서 가로 스크롤 (막대 최소 폭 확보) */
const CHART_MIN_WIDTH_PX = 560;

interface IProps {
  rows: TRow[];
}

const DifficultyBarChart: React.FC<IProps> = ({ rows }) => {
  const chartData = rows.map((r) => ({
    grade: r.difficulty,
    count: r.count,
  }));

  const maxCount = Math.max(0, ...chartData.map((d) => d.count));
  const yMax = Math.max(maxCount, 1);

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="mx-auto"
        style={{ minWidth: CHART_MIN_WIDTH_PX }}
      >
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 0, right: 8, top: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--outline-variant)"
              vertical
              horizontal
            />
            <XAxis
              dataKey="grade"
              type="category"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fill: "var(--on-surface-variant)", fontSize: 10 }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, yMax]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--on-surface-variant)", fontSize: 10 }}
              tickFormatter={(v) => String(Math.round(Number(v)))}
              width={28}
            />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default DifficultyBarChart;
