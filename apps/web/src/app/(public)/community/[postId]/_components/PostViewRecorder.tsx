"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchClient, openapi } from "#web/apis/openapi";

const VIEW_STORAGE_PREFIX = "clog:postView:";

interface IProps {
  postId: string;
}

/** 조회수 POST — 별도 GET 없음 */
const PostViewRecorder = ({ postId }: IProps) => {
  const queryClient = useQueryClient();
  const { queryKey: postQueryKey } = openapi.queryOptions(
    "get",
    "/api/v1/posts/{postId}",
    { params: { path: { postId } } },
  );

  useEffect(() => {
    const storageKey = `${VIEW_STORAGE_PREFIX}${postId}`;
    if (typeof window === "undefined" || sessionStorage.getItem(storageKey)) {
      return;
    }

    void (async () => {
      const { error } = await fetchClient.POST("/api/v1/posts/{postId}/view", {
        params: { path: { postId } },
      });
      if (!error) {
        sessionStorage.setItem(storageKey, "1");
        await queryClient.invalidateQueries({ queryKey: postQueryKey });
      }
    })();
  }, [postId, postQueryKey, queryClient]);

  return null;
};

export default PostViewRecorder;
