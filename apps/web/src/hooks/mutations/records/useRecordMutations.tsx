import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { revalidateTagForServer } from "#web/actions/revalidateForServer";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

const useRecordMutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "/api/v1/records");
  const path = queryKey[1];

  const recordCreateMutation = openapi.useMutation("post", "/api/v1/records", {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
      revalidateTagForServer([path]);
      router.replace(ROUTES.MY.path);
    },
  });

  const recordPatchMutation = openapi.useMutation(
    "patch",
    "/api/v1/records/{recordId}",
    {
      onSuccess(_data, variables) {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        const rid = variables.params.path.recordId;
        queryClient.invalidateQueries({
          queryKey: openapi.queryOptions("get", "/api/v1/records/{recordId}", {
            params: { path: { recordId: rid } },
          }).queryKey,
        });
        router.replace(ROUTES.RECORDS.DETAIL.path(rid));
      },
    },
  );

  const recordDeleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/records/{recordId}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        router.replace(ROUTES.MY.path);
      },
    },
  );

  return {
    recordCreateMutation,
    recordPatchMutation,
    recordDeleteMutation,
  };
};

export default useRecordMutations;
