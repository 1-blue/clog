"use client";

import { openapi } from "#web/apis/openapi";

import RecordDetailAuthorFooter from "./RecordDetailAuthorFooter";
import RecordDetailEditEntry from "./RecordDetailEditEntry";
import RecordDetailHeroCarousel from "./RecordDetailHeroCarousel";
import RecordDetailMemoBlock from "./RecordDetailMemoBlock";
import RecordDetailRoutesSection from "./RecordDetailRoutesSection";
import RecordDetailSessionCard from "./RecordDetailSessionCard";
import RecordDetailShareRow from "./RecordDetailShareRow";
import RecordDetailStatsPanel from "./RecordDetailStatsPanel";
import RecordDetailTopBar from "./RecordDetailTopBar";
import { getExerciseTimeSummary } from "./record-detail-utils";

interface IProps {
  recordId: string;
}

const RecordDetailMain = ({ recordId }: IProps) => {
  const { data: record } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/records/{recordId}",
    { params: { path: { recordId } } },
    { select: (d) => d.payload },
  );

  if (!record) {
    return (
      <div className="flex h-60 items-center justify-center px-4">
        <p className="text-sm text-on-surface-variant">
          기록을 찾을 수 없습니다
        </p>
      </div>
    );
  }

  const exercise = getExerciseTimeSummary(record.startTime, record.endTime);

  return (
    <div className="pb-10">
      <RecordDetailTopBar />
      <RecordDetailHeroCarousel images={record.images} />
      <div className="relative z-10 -mt-10 px-4">
        <RecordDetailEditEntry
          recordUserId={record.user.id}
          recordId={recordId}
        />
        <RecordDetailSessionCard record={record} exercise={exercise} />
        <RecordDetailStatsPanel record={record} exercise={exercise} />
        <div className="mt-10">
          <RecordDetailRoutesSection routes={record.routes} />
        </div>
        <RecordDetailMemoBlock memo={record.memo} />
        <RecordDetailShareRow />
        <RecordDetailAuthorFooter record={record} />
      </div>
    </div>
  );
};

export default RecordDetailMain;
