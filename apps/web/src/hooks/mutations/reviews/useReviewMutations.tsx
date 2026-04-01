import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

const useReviewMutations = (gymId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const listQuery = openapi.queryOptions(
    "get",
    "/api/v1/gyms/{gymId}/reviews",
    { params: { path: { gymId } } },
  );
  const myReviewQuery = openapi.queryOptions(
    "get",
    "/api/v1/gyms/{gymId}/reviews/me",
    { params: { path: { gymId } } },
  );

  const reviewCreateMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/reviews",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listQuery.queryKey });
        queryClient.invalidateQueries({ queryKey: myReviewQuery.queryKey });
        router.replace(ROUTES.GYMS.DETAIL.path(gymId));
      },
    },
  );

  const reviewUpdateMutation = openapi.useMutation(
    "patch",
    "/api/v1/gyms/{gymId}/reviews/{reviewId}",
    {
      onSuccess: (_data, variables) => {
        const reviewId = variables.params.path.reviewId;
        queryClient.invalidateQueries({ queryKey: listQuery.queryKey });
        queryClient.invalidateQueries({ queryKey: myReviewQuery.queryKey });
        queryClient.invalidateQueries({
          queryKey: openapi.queryOptions(
            "get",
            "/api/v1/gyms/{gymId}/reviews/{reviewId}",
            { params: { path: { gymId, reviewId } } },
          ).queryKey,
        });
        router.replace(ROUTES.GYMS.DETAIL.path(gymId));
      },
    },
  );

  return {
    reviewCreateMutation,
    reviewUpdateMutation,
  };
};

export default useReviewMutations;
