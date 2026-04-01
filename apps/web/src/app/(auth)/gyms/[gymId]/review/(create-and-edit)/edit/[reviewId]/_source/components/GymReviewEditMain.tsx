"use client";

import { type FieldErrors, FormProvider } from "react-hook-form";

import { openapi } from "#web/apis/openapi";
import useReviewMutations from "#web/hooks/mutations/reviews/useReviewMutations";

import GymReviewFormStickyBar from "../../../../_source/components/gym-review-form-sticky-bar/GymReviewFormStickyBar";
import useGymReviewForm, {
  type TGymReviewFormData,
} from "../../../../_source/_hooks/useGymReviewForm";
import GymReviewFeatureChips from "../../../../_source/components/gym-review/form/GymReviewFeatureChips";
import GymReviewPerceivedDifficulty from "../../../../_source/components/gym-review/form/GymReviewPerceivedDifficulty";
import GymReviewPhotoSection from "../../../../_source/components/gym-review/form/GymReviewPhotoSection";
import GymReviewRatingSection from "../../../../_source/components/gym-review/form/GymReviewRatingSection";
import GymReviewStoryField from "../../../../_source/components/gym-review/form/GymReviewStoryField";
import GymReviewTopBar from "../../../../_source/components/gym-review/GymReviewTopBar";
import GymReviewGymHeader from "../../../../_source/components/gym-review/header/GymReviewGymHeader";
import GymReviewNoticeCard from "../../../../_source/components/gym-review/header/GymReviewNoticeCard";

interface IProps {
  gymId: string;
  reviewId: string;
}

const scrollToFirstInvalid = (errors: FieldErrors<TGymReviewFormData>) => {
  const order: (keyof TGymReviewFormData)[] = ["rating", "content"];
  for (const key of order) {
    if (errors[key]) {
      const id =
        key === "rating"
          ? "gym-review-rating"
          : key === "content"
            ? "gym-review-story"
            : undefined;
      if (id) {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      break;
    }
  }
};

const GymReviewEditMain = ({ gymId, reviewId }: IProps) => {
  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const { data: review } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}/reviews/{reviewId}",
    { params: { path: { gymId, reviewId } } },
    { select: (d) => d.payload },
  );

  const methods = useGymReviewForm({
    defaultValues: {
      rating: review.rating,
      content: review.content,
      perceivedDifficulty: review.perceivedDifficulty ?? undefined,
      features: review.features ?? [],
      imageUrls: review.imageUrls ?? [],
    },
  });

  const { handleSubmit } = methods;

  const { reviewUpdateMutation } = useReviewMutations(gymId);

  const onValid = (data: TGymReviewFormData) => {
    reviewUpdateMutation.mutate({
      params: { path: { gymId, reviewId } },
      body: data,
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-svh bg-background pb-[calc(4.5rem+max(1.25rem,env(safe-area-inset-bottom)))]">
          <GymReviewTopBar title="리뷰 수정" />

          <div className="mx-auto flex max-w-lg flex-col gap-6 pt-5">
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
      <GymReviewFormStickyBar
        label="수정"
        pending={reviewUpdateMutation.isPending}
        onSubmit={() => {
          void handleSubmit(onValid, scrollToFirstInvalid)();
        }}
      />
    </>
  );
};

export default GymReviewEditMain;
