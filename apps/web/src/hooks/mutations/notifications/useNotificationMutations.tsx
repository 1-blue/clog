import { useQueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";

const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const markReadMutation = openapi.useMutation(
    "patch",
    "/api/v1/notifications/read",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/notifications"],
        });
      },
    },
  );

  return {
    markReadMutation,
  };
};

export default useNotificationMutations;
