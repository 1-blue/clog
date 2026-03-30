"use client";

import { FormProvider } from "react-hook-form";

import { normalizeSessionTimeRange } from "@clog/utils";

import RecordDiscardRow from "#web/app/(auth)/records/_source/components/RecordDiscardRow";
import RecordFormTopBar from "#web/app/(auth)/records/_source/components/RecordFormTopBar";
import useRecordMutations from "#web/hooks/mutations/records/useRecordMutations";

import useRecordForm, { type TRecordFormData } from "../../hooks/useRecordForm";
import RecordDurationField from "./RecordDurationField";
import RecordGallerySection from "./RecordGallerySection";
import RecordGymSearchField from "./RecordGymSearchField";
import RecordMemoField from "./RecordMemoField";
import RecordPublicToggleCard from "./RecordPublicToggleCard";
import RecordRoutesSection from "./RecordRoutesSection";
import RecordVisitDateField from "./RecordVisitDateField";

const RecordNewMain = () => {
  const methods = useRecordForm();
  const { handleSubmit, watch } = methods;
  const gymId = watch("gymId");
  const routesLen = watch("routes").length;

  const { recordCreateMutation } = useRecordMutations();

  const onSubmit = (data: TRecordFormData) => {
    const { startMinutes, endMinutes } = normalizeSessionTimeRange(
      data.startMinutes,
      data.endMinutes,
    );
    const visitNoon = new Date(`${data.dateYmd}T12:00:00`);
    const atDay = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return new Date(
        `${data.dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
      ).toISOString();
    };

    recordCreateMutation.mutate({
      body: {
        gymId: data.gymId,
        date: visitNoon.toISOString(),
        startTime: atDay(startMinutes),
        endTime: atDay(endMinutes),
        memo: data.memo?.trim() || undefined,
        isPublic: data.isPublic,
        routes: data.routes.map(({ difficulty, result, attempts }) => ({
          difficulty,
          result,
          attempts,
        })),
        ...(data.imageUrls?.length ? { imageUrls: data.imageUrls } : {}),
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-svh bg-background pb-10">
        <RecordFormTopBar
          title="기록 추가"
          onSave={handleSubmit(onSubmit)}
          saveDisabled={!gymId || routesLen === 0}
          savePending={recordCreateMutation.isPending}
        />

        <div className="mx-auto max-w-lg space-y-5 px-4 pt-4">
          <RecordGallerySection maxFiles={5} />
          <RecordVisitDateField />
          <RecordGymSearchField />
          <RecordDurationField />
          <RecordRoutesSection />
          <RecordMemoField />
          <RecordPublicToggleCard />
          <RecordDiscardRow />
        </div>
      </div>
    </FormProvider>
  );
};

export default RecordNewMain;
