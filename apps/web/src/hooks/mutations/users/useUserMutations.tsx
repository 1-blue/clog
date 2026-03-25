import { useQueryClient } from "@tanstack/react-query";

import { revalidateTagForServer } from "#web/actions/revalidateForServer";
import { openapi } from "#web/apis/openapi";

const useUserMutations = () => {
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "/api/v1/users/me");
  const path = queryKey[1];

  const updateMeMutation = openapi.useMutation("patch", "/api/v1/users/me", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      revalidateTagForServer([path]);
    },
  });

  const toggleFollowMutation = openapi.useMutation(
    "post",
    "/api/v1/users/{userId}/follow",
    {
      onSuccess: (_data, variables) => {
        const uid = variables.params.path.userId;
        queryClient.invalidateQueries(
          openapi.queryOptions("get", "/api/v1/users/{userId}", {
            params: { path: { userId: uid } },
          }),
        );
        queryClient.invalidateQueries(
          openapi.queryOptions("get", "/api/v1/users/me"),
        );
      },
    },
  );

  return {
    updateMeMutation,
    toggleFollowMutation,
  };
};

export default useUserMutations;
