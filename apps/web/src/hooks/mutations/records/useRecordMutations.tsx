import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { revalidateTagForServer } from "#web/actions/revalidateForServer";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { extractApiToastAsync } from "#web/libs/api/extractApiToast";
import { invalidateUserMembershipQueries } from "#web/libs/react-query/invalidateUserMembershipQueries";

const useRecordMutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "/api/v1/records");
  const path = queryKey[1];

  const recordCreateMutation = openapi.useMutation("post", "/api/v1/records", {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
      invalidateUserMembershipQueries(queryClient);
      revalidateTagForServer([path]);
      router.replace(ROUTES.MY.path);
    },
    async onError(err) {
      const msg =
        (await extractApiToastAsync(err)) ?? "기록 저장에 실패했습니다.";
      toast.error(msg);
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
        invalidateUserMembershipQueries(queryClient);
        router.replace(ROUTES.RECORDS.DETAIL.path(rid));
      },
      async onError(err) {
        const msg =
          (await extractApiToastAsync(err)) ?? "기록 수정에 실패했습니다.";
        toast.error(msg);
      },
    },
  );

  const recordDeleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/records/{recordId}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        invalidateUserMembershipQueries(queryClient);
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
