import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { revalidateTagForServer } from "#web/actions/revalidateForServer";
import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";

type PostPayload = components["schemas"]["Post"];

/** openapi-fetch 응답이 `{ payload }` 또는 `{ data: { payload } }` 형태일 수 있음 */
const getCreatedPostPayload = (result: unknown): PostPayload | undefined => {
  if (!result || typeof result !== "object") return undefined;
  const r = result as Record<string, unknown>;
  if (
    r.payload &&
    typeof r.payload === "object" &&
    "id" in (r.payload as object)
  ) {
    return r.payload as PostPayload;
  }
  const inner = r.data as Record<string, unknown> | undefined;
  if (
    inner?.payload &&
    typeof inner.payload === "object" &&
    "id" in (inner.payload as object)
  ) {
    return inner.payload as PostPayload;
  }
  return undefined;
};

const usePostMutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "/api/v1/posts");
  const path = queryKey[1];

  const postCreateMutation = openapi.useMutation("post", "/api/v1/posts", {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey });
      revalidateTagForServer([path]);
      const payload = getCreatedPostPayload(data);
      const postId = payload?.id;
      if (postId) {
        router.replace(ROUTES.COMMUNITY.DETAIL.path(postId));
      } else {
        router.replace(ROUTES.COMMUNITY.path);
      }
    },
  });

  const postPatchMutation = openapi.useMutation(
    "patch",
    "/api/v1/posts/{postId}",
    {
      onSuccess(_data, variables) {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        const postId = variables.params.path.postId;
        queryClient.invalidateQueries({
          queryKey: openapi.queryOptions("get", "/api/v1/posts/{postId}", {
            params: { path: { postId } },
          }).queryKey,
        });
        router.replace(ROUTES.COMMUNITY.DETAIL.path(postId));
      },
    },
  );

  const postDeleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/posts/{postId}",
    {
      onSuccess(_data, variables) {
        const postId = variables.params.path.postId;
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({
          queryKey: openapi.queryOptions("get", "/api/v1/posts/{postId}", {
            params: { path: { postId } },
          }).queryKey,
        });
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
