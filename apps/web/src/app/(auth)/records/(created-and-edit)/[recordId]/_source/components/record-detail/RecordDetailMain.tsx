"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import { getExerciseTimeSummary } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import RecordDetailAuthorFooter from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/blocks/RecordDetailAuthorFooter";
import RecordDetailEditEntry from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/blocks/RecordDetailEditEntry";
import RecordDetailMemoBlock from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/blocks/RecordDetailMemoBlock";
import RecordDetailShareRow from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/blocks/RecordDetailShareRow";
import RecordDetailGymDifficultySection from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/difficulty/RecordDetailGymDifficultySection";
import RecordDetailResultGlossary from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/glossary/RecordDetailResultGlossary";
import RecordDetailHeroCarousel from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/media/RecordDetailHeroCarousel";
import RecordDetailRoutesSection from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/records/RecordDetailRoutesSection";
import RecordDetailSessionCard from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/summary/RecordDetailSessionCard";
import RecordDetailStatsPanel from "#web/app/(auth)/records/(created-and-edit)/[recordId]/_source/components/record-detail/summary/RecordDetailStatsPanel";
import AppTopBar from "#web/components/layout/AppTopBar";

type TRecordDetail = components["schemas"]["RecordDetail"];

interface IContentProps {
  recordId: string;
  record: TRecordDetail;
}

const RecordDetailLoaded = ({ recordId, record }: IContentProps) => {
  const router = useRouter();

  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId: record.gym.id } } },
    { select: (d) => d.payload },
  );

  const exercise = getExerciseTimeSummary(record.startTime, record.endTime);
  const difficultyColors = gym?.difficultyColors;

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-10">
      <AppTopBar
        className="border-outline-variant bg-surface-container/80"
        showNotification={false}
        left={
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
              aria-label="뒤로"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-on-surface">
              클라이밍 기록 상세
            </h1>
          </div>
        }
        right={<></>}
      />

      <RecordDetailHeroCarousel imageUrls={record.imageUrls} />

      <div className="relative z-10 -mt-6 flex flex-col gap-10 px-4">
        <RecordDetailEditEntry
          recordUserId={record.user.id}
          recordId={recordId}
        />

        <RecordDetailSessionCard record={record} exercise={exercise} />

        <RecordDetailGymDifficultySection difficultyColors={difficultyColors} />

        <RecordDetailStatsPanel
          record={record}
          exercise={exercise}
          difficultyColors={difficultyColors}
        />

        <RecordDetailMemoBlock memo={record.memo} />

        <RecordDetailRoutesSection
          routes={record.routes}
          difficultyColors={difficultyColors}
        />

        <RecordDetailResultGlossary />

        <RecordDetailShareRow />

        <RecordDetailAuthorFooter record={record} />
      </div>
    </div>
  );
};

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

  return <RecordDetailLoaded recordId={recordId} record={record} />;
};

export default RecordDetailMain;
