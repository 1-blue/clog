-- review_features 정규화 테이블 제거 → reviews.features 에 enum 배열로 통합

DROP TABLE "review_features";

ALTER TABLE "reviews"
ADD COLUMN "features" "GymReviewFeature"[] NOT NULL DEFAULT ARRAY[]::"GymReviewFeature"[];
