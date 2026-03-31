"use client";

import { FormProvider } from "react-hook-form";

import { normalizeSessionTimeRange } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import RecordDiscardRow from "#web/app/(auth)/records/_source/components/RecordDiscardRow";
import RecordFormTopBar from "#web/app/(auth)/records/_source/components/RecordFormTopBar";
import RecordGymReadonlyCard from "#web/app/(auth)/records/_source/components/RecordGymReadonlyCard";
import {
  initialSessionMinutesFromRecord,
  recordDateToYmd,
} from "#web/app/(auth)/records/_source/components/sessionTimesFromRecord";
import RecordDurationField from "#web/app/(auth)/records/new/_source/components/record-new/RecordDurationField";
import RecordGallerySection from "#web/app/(auth)/records/new/_source/components/record-new/RecordGallerySection";
import RecordMemoField from "#web/app/(auth)/records/new/_source/components/record-new/RecordMemoField";
import RecordPublicToggleCard from "#web/app/(auth)/records/new/_source/components/record-new/RecordPublicToggleCard";
import RecordRoutesSection from "#web/app/(auth)/records/new/_source/components/record-new/RecordRoutesSection";
import RecordVisitDateField from "#web/app/(auth)/records/new/_source/components/record-new/RecordVisitDateField";
import useRecordForm, {
  type TRecordFormData,
} from "#web/app/(auth)/records/new/_source/hooks/useRecordForm";
import useRecordMutations from "#web/hooks/mutations/records/useRecordMutations";

type TRecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  recordId: string;
  record: TRecordDetail;
}

const RecordEditForm: React.FC<IProps> = ({ recordId, record }) => {
  const { startMinutes, endMinutes } = initialSessionMinutesFromRecord(
    record.startTime,
    record.endTime,
  );

  const methods = useRecordForm({
    defaultValues: {
      gymId: record.gym.id,
      gymName: record.gym.name,
      dateYmd: recordDateToYmd(record.date),
      startMinutes,
      endMinutes,
      memo: record.memo ?? "",
      isPublic: record.isPublic,
      routes: record.routes.map(({ difficulty, result, attempts }) => ({
        difficulty,
        result,
        attempts,
      })),
      imageUrls: record.imageUrls,
    },
  });

  const { handleSubmit, watch } = methods;
  const routesLen = watch("routes").length;

  const { recordPatchMutation } = useRecordMutations();

  const onSubmit = (data: TRecordFormData) => {
    const { startMinutes: sMin, endMinutes: eMin } = normalizeSessionTimeRange(
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

    recordPatchMutation.mutate({
      params: { path: { recordId } },
      body: {
        date: visitNoon.toISOString(),
        startTime: atDay(sMin),
        endTime: atDay(eMin),
        memo: data.memo?.trim() === "" ? null : data.memo?.trim(),
        isPublic: data.isPublic,
        routes: data.routes.map(({ difficulty, result, attempts }) => ({
          difficulty,
          result,
          attempts,
        })),
        imageUrls: data.imageUrls ?? [],
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-svh bg-background pb-10">
        <RecordFormTopBar
          title="기록 수정"
          onSave={handleSubmit(onSubmit)}
          saveDisabled={routesLen === 0}
          savePending={recordPatchMutation.isPending}
        />

        <div className="mx-auto max-w-lg space-y-5 px-4 pt-4">
          <RecordGallerySection maxFiles={5} />
          <RecordVisitDateField />
          <RecordGymReadonlyCard
            name={record.gym.name}
            address={record.gym.address}
          />
          <RecordDurationField />
          <RecordRoutesSection />
          <RecordMemoField />
          <RecordPublicToggleCard />
          <RecordDiscardRow label="수정 취소" />
        </div>
      </div>
    </FormProvider>
  );
};

export default RecordEditForm;
