import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

const useReviewMutations = (gymId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { queryKey } = openapi.queryOptions(
    "get",
    "/api/v1/gyms/{gymId}/reviews",
    { params: { path: { gymId } } },
  );

  const reviewCreateMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/reviews",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        router.replace(ROUTES.GYMS.DETAIL.path(gymId));
      },
    },
  );

  return {
    reviewCreateMutation,
  };
};

export default useReviewMutations;
