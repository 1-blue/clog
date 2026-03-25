import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { revalidateTagForServer } from "#web/actions/revalidateForServer";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

const usePostMutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "/api/v1/posts");
  const path = queryKey[1];

  const postCreateMutation = openapi.useMutation("post", "/api/v1/posts", {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
      revalidateTagForServer([path]);
      router.replace(ROUTES.COMMUNITY.path);
    },
  });

  const postPatchMutation = openapi.useMutation(
    "patch",
    "/api/v1/posts/{postId}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
      },
    },
  );

  const postDeleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/posts/{postId}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        router.replace(ROUTES.COMMUNITY.path);
      },
    },
  );

  return {
    postCreateMutation,
    postPatchMutation,
    postDeleteMutation,
  };
};

export default usePostMutations;
