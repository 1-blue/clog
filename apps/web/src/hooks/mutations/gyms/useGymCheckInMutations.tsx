"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { openapi } from "#web/apis/openapi";

interface IOptions {
  onCheckInSuccess?: () => void;
}

const useGymCheckInMutations = (options?: IOptions) => {
  const queryClient = useQueryClient();
  const { queryKey: meQueryKey } = openapi.queryOptions("get", "/api/v1/users/me");

  /** 혼잡도 랭킹·암장 목록 등 visitorCount 반영 */
  const invalidateGymListQueries = () =>
    void queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/gyms"] });

  const checkInMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-in",
    {
      onMutate: async (variables) => {
        const gymId = variables.params.path.gymId;

        // 캐시된 gym 목록에서 gymId에 해당하는 gym 이름 찾기
        const cachedGymQueries = queryClient.getQueriesData<any>({
          queryKey: ["get", "/api/v1/gyms"],
        });
        let gymName: string | undefined;
        for (const [, data] of cachedGymQueries) {
          const gym = data?.payload?.items?.find((g: any) => g.id === gymId);
          if (gym) {
            gymName = gym.name;
            break;
          }
        }

        await queryClient.cancelQueries({ queryKey: meQueryKey });
        const previous = queryClient.getQueryData(meQueryKey);

        if (gymName) {
          queryClient.setQueryData(meQueryKey, (old: any) => {
            if (!old?.payload) return old;
            const now = new Date();
            return {
              ...old,
              payload: {
                ...old.payload,
                activeCheckIn: {
                  id: "optimistic",
                  gymId,
                  gymName,
                  startedAt: now.toISOString(),
                  endsAt: new Date(now.getTime() + 3 * 60 * 60_000).toISOString(),
                },
              },
            };
          });
        }
        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(meQueryKey, context.previous);
        }
        toast.error("체크인에 실패했습니다.");
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: meQueryKey });
        invalidateGymListQueries();
        toast.success("체크인했어요!");
        options?.onCheckInSuccess?.();
      },
    },
  );

  const checkOutMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-out",
    {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: meQueryKey });
        const previous = queryClient.getQueryData(meQueryKey);
        queryClient.setQueryData(meQueryKey, (old: any) => {
          if (!old?.payload) return old;
          return { ...old, payload: { ...old.payload, activeCheckIn: null } };
        });
        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(meQueryKey, context.previous);
        }
        toast.error("체크아웃에 실패했습니다.");
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: meQueryKey });
        invalidateGymListQueries();
        toast.success("체크아웃했어요.");
      },
    },
  );

  return { checkInMutation, checkOutMutation };
};

export default useGymCheckInMutations;
