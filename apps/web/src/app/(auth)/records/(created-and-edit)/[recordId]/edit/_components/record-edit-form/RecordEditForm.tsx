"use client";

import { FormProvider } from "react-hook-form";

import { normalizeSessionTimeRange } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import RecordDiscardRow from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordDiscardRow";
import RecordDurationField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordDurationField";
import RecordFormSaveBar from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordFormSaveBar";
import RecordGallerySection from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGallerySection";
import RecordGymDifficultyLegend from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymDifficultyLegend";
import RecordGymReadonlyCard from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymReadonlyCard";
import RecordMemoField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordMemoField";
import RecordPublicToggleCard from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordPublicToggleCard";
import RecordRoutesSection from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordRoutesSection";
import RecordVisitDateField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordVisitDateField";
import useRecordForm, {
  type TRecordFormData,
} from "#web/app/(auth)/records/(created-and-edit)/_source/hooks/useRecordForm";
import {
  initialSessionMinutesFromRecord,
  recordDateToYmd,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/sessionTimesFromRecord";
import TopBar from "#web/components/layout/TopBar";
import { ROUTES } from "#web/constants";
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

  const { handleSubmit } = methods;

  const { data: gym } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId: record.gym.id } } },
    { select: (d) => d.payload },
  );

  const difficultyColors = gym?.difficultyColors;

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
      <div className="flex min-h-dvh flex-col bg-background">
        <TopBar
          className="border-outline-variant bg-surface-container/80"
          showNotification={false}
          title="기록 수정"
        />

        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mx-auto flex w-full max-w-lg flex-col gap-8 pt-4 pb-[calc(6rem+max(1.25rem,env(safe-area-inset-bottom)))]">
            <RecordGallerySection />
            <RecordVisitDateField />
            <RecordGymReadonlyCard
              name={record.gym.name}
              address={record.gym.address}
            />
            <RecordGymDifficultyLegend difficultyColors={difficultyColors} />
            <RecordDurationField />
            <RecordRoutesSection difficultyColors={difficultyColors} />

            <div className="flex flex-col gap-4">
              <RecordMemoField />
              <RecordPublicToggleCard />
              <RecordDiscardRow
                replaceHref={ROUTES.RECORDS.DETAIL.path(recordId)}
                label="수정 취소"
              />
            </div>
          </div>

          <RecordFormSaveBar savePending={recordPatchMutation.isPending} />
        </form>
      </div>
    </FormProvider>
  );
};

export default RecordEditForm;
