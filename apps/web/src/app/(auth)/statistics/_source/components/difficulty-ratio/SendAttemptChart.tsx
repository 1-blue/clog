"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { components } from "#web/@types/openapi";

type TSend = components["schemas"]["MeStatisticsPayload"]["sendAttempt"];

interface IProps {
  sendAttempt: TSend;
}

const SendAttemptChart: React.FC<IProps> = ({ sendAttempt }) => {
  const { sendCount, attemptCount, totalRoutes, percent } = sendAttempt;

  if (totalRoutes === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center text-xs text-on-surface-variant">
        아직 루트 기록이 없어요
      </div>
    );
  }

  const pieData = [
    { key: "send", value: sendCount, fill: "var(--secondary)" },
    { key: "attempt", value: attemptCount, fill: "var(--surface-variant)" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto h-36 w-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="key"
              innerRadius={48}
              outerRadius={64}
              strokeWidth={0}
              paddingAngle={2}
            >
              {pieData.map((d) => (
                <Cell key={d.key} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-lg font-bold text-secondary tabular-nums">
            {sendCount}/{totalRoutes}
          </span>
          <span className="text-[10px] font-semibold text-on-surface-variant tabular-nums">
            {percent ?? 0}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-on-surface-variant">
        완등 / 전체 루트
      </p>
    </div>
  );
};

export default SendAttemptChart;
