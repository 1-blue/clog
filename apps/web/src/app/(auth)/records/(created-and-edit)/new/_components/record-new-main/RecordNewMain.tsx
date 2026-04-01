"use client";

import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { FormProvider, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { normalizeSessionTimeRange } from "@clog/utils";

import { openapi } from "#web/apis/openapi";
import { getSelectedDateFromQuery } from "#web/app/(auth)/records/_source/utils/records-list-date";
import RecordDiscardRow from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordDiscardRow";
import RecordDurationField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordDurationField";
import RecordFormSaveBar from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordFormSaveBar";
import RecordGallerySection from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGallerySection";
import RecordGymDifficultyLegend from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymDifficultyLegend";
import RecordGymSearchField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymSearchField";
import RecordMemoField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordMemoField";
import RecordPublicToggleCard from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordPublicToggleCard";
import RecordRoutesSection from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordRoutesSection";
import RecordVisitDateField from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordVisitDateField";
import { useRecordCreateDraftPersistence } from "#web/app/(auth)/records/(created-and-edit)/_source/hooks/useRecordCreateDraftPersistence";
import useRecordForm, {
  type TRecordFormData,
} from "#web/app/(auth)/records/(created-and-edit)/_source/hooks/useRecordForm";
import { removeRecordCreateDraftForDate } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-create-draft-storage";
import useRecordMutations from "#web/hooks/mutations/records/useRecordMutations";
import AppTopBar from "#web/components/layout/AppTopBar";

const RecordNewMain = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDateYmd = useMemo(
    () =>
      format(
        getSelectedDateFromQuery((k) => searchParams.get(k)),
        "yyyy-MM-dd",
      ),
    [searchParams],
  );

  const methods = useRecordForm({
    defaultValues: { dateYmd: prefilledDateYmd },
  });
  const { onBeforeDateYmdChange } = useRecordCreateDraftPersistence(methods);
  const { control, handleSubmit, getValues } = methods;
  const gymId = useWatch({ control, name: "gymId" });

  const { recordCreateMutation } = useRecordMutations();

  const { data: gym } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId: gymId ?? "" } } },
    {
      enabled: Boolean(gymId),
      select: (d) => d.payload,
    },
  );

  const difficultyColors = gym?.difficultyColors;

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

    recordCreateMutation.mutate(
      {
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
      },
      {
        onSuccess: () => {
          removeRecordCreateDraftForDate(data.dateYmd);
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-dvh flex-col bg-background">
        <AppTopBar
          className="bg-surface-container/80 border-outline-variant"
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
                기록 추가
              </h1>
            </div>
          }
          right={<></>}
        />

        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mx-auto flex w-full max-w-lg flex-col gap-8 pt-4 pb-[calc(6rem+max(1.25rem,env(safe-area-inset-bottom)))]">
            <RecordGallerySection />
            <RecordVisitDateField
              onBeforeDateYmdChange={onBeforeDateYmdChange}
            />
            <RecordGymSearchField />
            {gymId ? (
              <RecordGymDifficultyLegend difficultyColors={difficultyColors} />
            ) : null}
            <RecordDurationField />
            <RecordRoutesSection difficultyColors={difficultyColors} />
            <RecordMemoField />
            <RecordPublicToggleCard />
            <RecordDiscardRow
              onBeforeBack={() => {
                const y = getValues("dateYmd");
                if (y && /^\d{4}-\d{2}-\d{2}$/.test(y)) {
                  removeRecordCreateDraftForDate(y);
                }
              }}
            />
          </div>

          <RecordFormSaveBar savePending={recordCreateMutation.isPending} />
        </form>
      </div>
    </FormProvider>
  );
};

export default RecordNewMain;
