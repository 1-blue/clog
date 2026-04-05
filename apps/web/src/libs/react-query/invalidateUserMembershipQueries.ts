import type { QueryClient } from "@tanstack/react-query";

/** 목록·상세·usage·pauses 등 `GET /api/v1/users/me/memberships` 하위 쿼리 전부 */
export const invalidateUserMembershipQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({
    predicate: (q) =>
      Array.isArray(q.queryKey) &&
      q.queryKey[0] === "get" &&
      typeof q.queryKey[1] === "string" &&
      q.queryKey[1].includes("/api/v1/users/me/memberships"),
  });
};
