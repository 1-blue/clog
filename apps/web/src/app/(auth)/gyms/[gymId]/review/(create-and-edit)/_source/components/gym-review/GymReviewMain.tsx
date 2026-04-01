"use client";

import { type FieldErrors, FormProvider } from "react-hook-form";

import { openapi } from "#web/apis/openapi";
import useReviewMutations from "#web/hooks/mutations/reviews/useReviewMutations";

import useGymReviewForm, {
  type TGymReviewFormData,
} from "../../_hooks/useGymReviewForm";
import GymReviewFormStickyBar from "../gym-review-form-sticky-bar/GymReviewFormStickyBar";
import GymReviewFeatureChips from "./form/GymReviewFeatureChips";
import GymReviewPerceivedDifficulty from "./form/GymReviewPerceivedDifficulty";
import GymReviewPhotoSection from "./form/GymReviewPhotoSection";
import GymReviewRatingSection from "./form/GymReviewRatingSection";
import GymReviewStoryField from "./form/GymReviewStoryField";
import GymReviewTopBar from "./GymReviewTopBar";
import GymReviewGymHeader from "./header/GymReviewGymHeader";
import GymReviewNoticeCard from "./header/GymReviewNoticeCard";

interface IProps {
  gymId: string;
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

const GymReviewMain = ({ gymId }: IProps) => {
  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const methods = useGymReviewForm();
  const { handleSubmit } = methods;

  const { reviewCreateMutation } = useReviewMutations(gymId);

  const onValid = (data: TGymReviewFormData) => {
    reviewCreateMutation.mutate({
      params: { path: { gymId } },
      body: data,
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-svh bg-background pb-[calc(4.5rem+max(1.25rem,env(safe-area-inset-bottom)))]">
          <GymReviewTopBar title="리뷰 작성" />

          <div className="mx-auto max-w-lg space-y-8 pt-5">
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
        label="저장"
        pending={reviewCreateMutation.isPending}
        onSubmit={() => {
          void handleSubmit(onValid, scrollToFirstInvalid)();
        }}
      />
    </>
  );
};

export default GymReviewMain;
