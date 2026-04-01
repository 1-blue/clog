import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { openapi } from "#web/apis/openapi";

const usePostDetailMutations = () => {
  const queryClient = useQueryClient();
  const params = useParams<{ postId: string }>();
  const { queryKey } = openapi.queryOptions("get", "/api/v1/posts/{postId}", {
    params: { path: { postId: params.postId } },
  });

  const toggleLikeMutation = openapi.useMutation(
    "post",
    "/api/v1/posts/{postId}/like",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/posts"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me/liked-posts"],
        });
      },
    },
  );

  const toggleBookmarkMutation = openapi.useMutation(
    "post",
    "/api/v1/posts/{postId}/bookmark",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/posts"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me/bookmarked-posts"],
        });
      },
    },
  );

  const createCommentMutation = openapi.useMutation(
    "post",
    "/api/v1/posts/{postId}/comments",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/posts/{postId}/comments"],
        });
      },
    },
  );

  const invalidatePostAndComments = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/posts/{postId}/comments"],
    });
  };

  const updateCommentMutation = openapi.useMutation(
    "patch",
    "/api/v1/posts/{postId}/comments/{commentId}",
    {
      onSuccess: invalidatePostAndComments,
    },
  );

  const deleteCommentMutation = openapi.useMutation(
    "delete",
    "/api/v1/posts/{postId}/comments/{commentId}",
    {
      onSuccess: invalidatePostAndComments,
    },
  );

  return {
    toggleLikeMutation,
    toggleBookmarkMutation,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
};

export default usePostDetailMutations;
