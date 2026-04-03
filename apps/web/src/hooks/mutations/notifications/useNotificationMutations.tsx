import { useQueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";

const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/notifications"],
    });
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/notifications/unread-count"],
    });
  };

  const markReadMutation = openapi.useMutation(
    "patch",
    "/api/v1/notifications/read",
    {
      onSuccess: invalidateList,
    },
  );

  const patchReadMutation = openapi.useMutation(
    "patch",
    "/api/v1/notifications/{id}",
    {
      onSuccess: invalidateList,
    },
  );

  const deleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/notifications/{id}",
    {
      onSuccess: invalidateList,
    },
  );

  return {
    markReadMutation,
    patchReadMutation,
    deleteMutation,
  };
};

export default useNotificationMutations;
