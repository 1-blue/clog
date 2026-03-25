"use client";

import { useState } from "react";

import { normalizeSessionTimeRange } from "@clog/utils";

import RecordDiscardRow from "#web/app/(auth)/records/_source/components/RecordDiscardRow";
import RecordFormTopBar from "#web/app/(auth)/records/_source/components/RecordFormTopBar";
import useRecordMutations from "#web/hooks/mutations/records/useRecordMutations";

import type { IRecordNewRouteEntry } from "./record-new-types";
import RecordDurationField from "./RecordDurationField";
import RecordGallerySection from "./RecordGallerySection";
import RecordGymSearchField from "./RecordGymSearchField";
import RecordMemoField from "./RecordMemoField";
import RecordPublicToggleCard from "./RecordPublicToggleCard";
import RecordRoutesSection from "./RecordRoutesSection";
import RecordVisitDateField from "./RecordVisitDateField";

const RecordNewMain = () => {
  const [gymId, setGymId] = useState("");
  const [gymName, setGymName] = useState("");
  const [dateYmd, setDateYmd] = useState(
    () => new Date().toISOString().split("T")[0]!,
  );
  const [sessionTimes, setSessionTimes] = useState(() =>
    normalizeSessionTimeRange(10 * 60 + 30, 14 * 60),
  );
  const [memo, setMemo] = useState("");
  const [routes, setRoutes] = useState<IRecordNewRouteEntry[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  const { recordCreateMutation } = useRecordMutations();

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

    recordCreateMutation.mutate({
      body: {
        gymId,
        date: visitNoon.toISOString(),
        startTime: atVisitDay(startMinutes).toISOString(),
        endTime: atVisitDay(endMinutes).toISOString(),
        memo: memo.trim() ? memo.trim() : undefined,
        isPublic,
        routes: routes.map((r) => ({
          difficulty: r.difficulty,
          result: r.result,
          attempts: r.attempts,
        })),
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
      },
    });
  };

  return (
    <div className="min-h-svh bg-background pb-10">
      <RecordFormTopBar
        title="기록 추가"
        onSave={save}
        saveDisabled={!gymId || routes.length === 0}
        savePending={recordCreateMutation.isPending}
      />

      <div className="mx-auto max-w-lg space-y-5 px-4 pt-4">
        <RecordGallerySection
          urls={imageUrls}
          onUrlsChange={setImageUrls}
          maxFiles={5}
        />

        <RecordVisitDateField value={dateYmd} onChange={setDateYmd} />

        <RecordGymSearchField
          gymId={gymId}
          gymName={gymName}
          onSelect={(id, name) => {
            setGymId(id);
            setGymName(name);
          }}
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

        <RecordDiscardRow />
      </div>
    </div>
  );
};

export default RecordNewMain;
