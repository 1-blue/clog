"use client";

import { FormProvider } from "react-hook-form";

import { openapi } from "#web/apis/openapi";
import useReviewMutations from "#web/hooks/mutations/reviews/useReviewMutations";

import GymReviewFeatureChips from "./form/GymReviewFeatureChips";
import GymReviewPerceivedDifficulty from "./form/GymReviewPerceivedDifficulty";
import GymReviewPhotoSection from "./form/GymReviewPhotoSection";
import GymReviewRatingSection from "./form/GymReviewRatingSection";
import GymReviewStoryField from "./form/GymReviewStoryField";
import GymReviewTopBar from "./GymReviewTopBar";
import GymReviewGymHeader from "./header/GymReviewGymHeader";
import GymReviewNoticeCard from "./header/GymReviewNoticeCard";
import useGymReviewForm from "./useGymReviewForm";

interface IProps {
  gymId: string;
}

const GymReviewMain = ({ gymId }: IProps) => {
  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const methods = useGymReviewForm();
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { reviewCreateMutation } = useReviewMutations(gymId);

  const onSubmit = handleSubmit((data) => {
    reviewCreateMutation.mutate({
      params: { path: { gymId } },
      body: data,
    });
  });

  return (
    <FormProvider {...methods}>
      <div className="min-h-svh bg-background pb-10">
        <GymReviewTopBar
          title="리뷰 작성"
          submitLabel="완료"
          onSubmit={onSubmit}
          submitDisabled={!isValid}
          submitPending={reviewCreateMutation.isPending}
        />

        <div className="mx-auto max-w-lg space-y-8 px-4 pt-5">
          <GymReviewGymHeader gym={gym} />
          <GymReviewRatingSection />
          <GymReviewFeatureChips />
          <GymReviewStoryField />
          <GymReviewPhotoSection />
          <GymReviewPerceivedDifficulty />
          <GymReviewNoticeCard />
        </div>
      </div>
    </FormProvider>
  );
};

export default GymReviewMain;
