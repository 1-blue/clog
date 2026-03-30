import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import type { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants";
import { getExerciseTimeSummary } from "#web/app/(auth)/records/[recordId]/_components/record-detail/record-detail-utils";

type TRecordListItem = components["schemas"]["RecordListItem"];

interface IProps {
  record: TRecordListItem;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  VB: "#E5E7EB",
  V0: "#E5E7EB",
  V1: "#F5DC4C",
  V2: "#F0A830",
  V3: "#5ABF72",
  V4: "#3A9EE0",
  V5: "#E05555",
  V6: "#A040C0",
  V7: "#8B5E3C",
  V8: "#888888",
  V9: "#111111",
  V10: "#111111",
  V_PLUS: "#999999",
};

const RecordDayCard: React.FC<IProps> = ({ record }) => {
  const exercise = getExerciseTimeSummary(record.startTime, record.endTime);

  const diffGroups = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const r of record.routes) {
      acc[r.difficulty] = (acc[r.difficulty] ?? 0) + 1;
    }
    return Object.entries(acc);
  }, [record.routes]);

  const sendCount = useMemo(
    () =>
      record.routes.filter((r) =>
        ["SEND", "FLASH", "ONSIGHT"].includes(r.result),
      ).length,
    [record.routes],
  );
  const totalRoutes = record.routes.length;

  const heroImage = record.images?.[0]?.url;

  return (
    <Link
      href={ROUTES.RECORDS.DETAIL.path(record.id)}
      className="block overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/10 transition-transform active:scale-[0.98]"
    >
      {/* 히어로 이미지 + 암장명 오버레이 */}
      <div className="relative aspect-[2/1] bg-surface-container-high">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-lg font-bold text-white drop-shadow">
            {record.gym.name}
          </p>
        </div>
      </div>

      {/* 시간 + 루트 정보 */}
      <div className="px-4 py-3">
        {exercise && (
          <div className="mb-2 flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {exercise.rangeLabel}
            </span>
            <span>{exercise.totalLabel}</span>
          </div>
        )}

        {totalRoutes > 0 && (
          <div className="mb-2 flex items-center gap-1 text-xs text-on-surface-variant">
            <CheckCircle2 className="size-3.5 text-primary" />
            <span>
              완등 {sendCount}/{totalRoutes}
            </span>
          </div>
        )}

        {diffGroups.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {diffGroups.map(([difficulty, count]) => (
              <span
                key={difficulty}
                className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      DIFFICULTY_COLORS[difficulty] ?? "#999999",
                  }}
                />
                {difficulty} x{count}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RecordDayCard;
