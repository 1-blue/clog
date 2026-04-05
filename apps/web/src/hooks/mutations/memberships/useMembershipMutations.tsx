import { useQueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { invalidateUserMembershipQueries } from "#web/libs/react-query/invalidateUserMembershipQueries";

const useMembershipMutations = () => {
  const queryClient = useQueryClient();

  const invalidateMemberships = () => {
    invalidateUserMembershipQueries(queryClient);
  };

  const createMutation = openapi.useMutation(
    "post",
    "/api/v1/users/me/memberships",
    { onSuccess: invalidateMemberships },
  );

  const patchMutation = openapi.useMutation(
    "patch",
    "/api/v1/users/me/memberships/{userMembershipId}",
    { onSuccess: invalidateMemberships },
  );

  const deleteMutation = openapi.useMutation(
    "delete",
    "/api/v1/users/me/memberships/{userMembershipId}",
    { onSuccess: invalidateMemberships },
  );

  const createPauseMutation = openapi.useMutation(
    "post",
    "/api/v1/users/me/memberships/{userMembershipId}/pauses",
    { onSuccess: invalidateMemberships },
  );

  const patchPauseMutation = openapi.useMutation(
    "patch",
    "/api/v1/users/me/memberships/{userMembershipId}/pauses/{pauseId}",
    { onSuccess: invalidateMemberships },
  );

  const deletePauseMutation = openapi.useMutation(
    "delete",
    "/api/v1/users/me/memberships/{userMembershipId}/pauses/{pauseId}",
    { onSuccess: invalidateMemberships },
  );

  return {
    createMutation,
    patchMutation,
    deleteMutation,
    createPauseMutation,
    patchPauseMutation,
    deletePauseMutation,
  };
};

export default useMembershipMutations;
