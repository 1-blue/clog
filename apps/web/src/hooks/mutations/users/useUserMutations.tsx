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
      onMutate: async (variables) => {
        const uid = variables.params.path.userId;
        const userQueryOptions = openapi.queryOptions(
          "get",
          "/api/v1/users/{userId}",
          { params: { path: { userId: uid } } },
        );

        await queryClient.cancelQueries(userQueryOptions);
        const prev = queryClient.getQueryData(userQueryOptions.queryKey);

        queryClient.setQueryData(userQueryOptions.queryKey, (old: unknown) => {
          const prevData = old as {
            payload?: {
              followers?: Array<{ id: string }> | null;
              _count?: { followers?: number | null } | null;
            };
          } | null;
          if (!prevData?.payload) return old;
          const isFollowing = (prevData.payload.followers?.length ?? 0) > 0;
          return {
            ...prevData,
            payload: {
              ...prevData.payload,
              followers: isFollowing ? [] : [{ id: "optimistic" }],
              _count: {
                ...(prevData.payload._count ?? {}),
                followers: isFollowing
                  ? Math.max(0, (prevData.payload._count?.followers ?? 0) - 1)
                  : (prevData.payload._count?.followers ?? 0) + 1,
              },
            },
          };
        });

        return { prev, queryKey: userQueryOptions.queryKey };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.prev) {
          queryClient.setQueryData(ctx.queryKey, ctx.prev);
        }
      },
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
