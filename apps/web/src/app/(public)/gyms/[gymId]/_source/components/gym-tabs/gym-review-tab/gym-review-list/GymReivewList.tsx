import { components } from "#web/@types/openapi";

import GymReview from "./GymReview";

interface IProps {
  reviews: components["schemas"]["ReviewListItem"][];
}

const GymReviewList: React.FC<IProps> = ({ reviews }) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {reviews.map((review) => (
        <GymReview key={review.id} review={review} />
      ))}
      {reviews.length === 0 && (
        <p className="py-4 text-center text-sm text-on-surface-variant">
          아직 리뷰가 없습니다
        </p>
      )}
    </div>
  );
};

export default GymReviewList;
