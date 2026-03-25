"use client";

import { useState } from "react";

import { normalizeSessionTimeRange } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import RecordDiscardRow from "#web/app/(auth)/records/_source/components/RecordDiscardRow";
import RecordFormTopBar from "#web/app/(auth)/records/_source/components/RecordFormTopBar";
import RecordGymReadonlyCard from "#web/app/(auth)/records/_source/components/RecordGymReadonlyCard";
import type { IRecordSessionRouteEntry } from "#web/app/(auth)/records/_source/components/record-session-types";
import {
  initialSessionMinutesFromRecord,
  recordDateToYmd,
} from "#web/app/(auth)/records/_source/components/sessionTimesFromRecord";
import useRecordMutations from "#web/hooks/mutations/records/useRecordMutations";

import RecordDurationField from "../../../../new/_components/record-new/RecordDurationField";
import RecordGallerySection from "../../../../new/_components/record-new/RecordGallerySection";
import RecordMemoField from "../../../../new/_components/record-new/RecordMemoField";
import RecordPublicToggleCard from "../../../../new/_components/record-new/RecordPublicToggleCard";
import RecordRoutesSection from "../../../../new/_components/record-new/RecordRoutesSection";
import RecordVisitDateField from "../../../../new/_components/record-new/RecordVisitDateField";

type TRecordDetail = components["schemas"]["RecordDetail"];

const routesFromRecord = (record: TRecordDetail): IRecordSessionRouteEntry[] =>
  record.routes.map((r) => ({
    difficulty: r.difficulty,
    result: r.result,
    attempts: r.attempts,
  }));

interface IProps {
  recordId: string;
  record: TRecordDetail;
}

const RecordEditForm: React.FC<IProps> = ({ recordId, record }) => {
  const [dateYmd, setDateYmd] = useState(() => recordDateToYmd(record.date));
  const [sessionTimes, setSessionTimes] = useState(() =>
    initialSessionMinutesFromRecord(record.startTime, record.endTime),
  );
  const [memo, setMemo] = useState(() => record.memo ?? "");
  const [routes, setRoutes] = useState<IRecordSessionRouteEntry[]>(() =>
    routesFromRecord(record),
  );
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    record.images.map((img) => img.url),
  );
  const [isPublic, setIsPublic] = useState(() => record.isPublic);

  const { recordPatchMutation } = useRecordMutations();

  const atVisitDay = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return new Date(
      `${dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
    );
  };

  const save = () => {
    const { startMinutes, endMinutes } = normalizeSessionTimeRange(
      sessionTimes.startMinutes,
      sessionTimes.endMinutes,
    );
    const visitNoon = new Date(`${dateYmd}T12:00:00`);

    recordPatchMutation.mutate({
      params: { path: { recordId } },
      body: {
        date: visitNoon.toISOString(),
        startTime: atVisitDay(startMinutes).toISOString(),
        endTime: atVisitDay(endMinutes).toISOString(),
        memo: memo.trim() === "" ? null : memo.trim(),
        isPublic,
        routes: routes.map((r) => ({
          difficulty: r.difficulty,
          result: r.result,
          attempts: r.attempts,
        })),
        imageUrls,
      },
    });
  };

  return (
    <div className="min-h-svh bg-background pb-10">
      <RecordFormTopBar
        title="기록 수정"
        onSave={save}
        saveDisabled={routes.length === 0}
        savePending={recordPatchMutation.isPending}
      />

      <div className="mx-auto max-w-lg space-y-5 px-4 pt-4">
        <RecordGallerySection
          urls={imageUrls}
          onUrlsChange={setImageUrls}
          maxFiles={5}
        />

        <RecordVisitDateField value={dateYmd} onChange={setDateYmd} />

        <RecordGymReadonlyCard
          name={record.gym.name}
          address={record.gym.address}
        />

        <RecordDurationField
          startMinutes={sessionTimes.startMinutes}
          endMinutes={sessionTimes.endMinutes}
          onChange={setSessionTimes}
        />

        <RecordRoutesSection
          routes={routes}
          onAddRoute={(entry) => setRoutes((prev) => [...prev, entry])}
          onRemoveRoute={(i) =>
            setRoutes((prev) => prev.filter((_, idx) => idx !== i))
          }
          onChangeAttempts={(i, n) =>
            setRoutes((prev) =>
              prev.map((r, idx) => (idx === i ? { ...r, attempts: n } : r)),
            )
          }
        />

        <RecordMemoField value={memo} onChange={setMemo} />

        <RecordPublicToggleCard
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />

        <RecordDiscardRow label="수정 취소" />
      </div>
    </div>
  );
};

export default RecordEditForm;
