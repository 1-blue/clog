"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { extractCheckoutCreatedSessionId } from "#web/libs/api/extractCheckoutCreatedSessionId";

interface IOptions {
  onCheckInSuccess?: () => void;
}

const useGymCheckInMutations = (options?: IOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { queryKey: meQueryKey } = openapi.queryOptions(
    "get",
    "/api/v1/users/me",
  );

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
        const cachedGymQueries = queryClient.getQueriesData<unknown>({
          queryKey: ["get", "/api/v1/gyms"],
        });
        let gymName: string | undefined;
        for (const [, data] of cachedGymQueries) {
          const payload = (data as { payload?: { items?: unknown[] } } | null)
            ?.payload;
          const items = payload?.items ?? [];
          const gym = items.find((g) => {
            const gg = g as { id?: string; name?: string } | null;
            return gg?.id === gymId;
          }) as { id?: string; name?: string } | undefined;
          if (gym) {
            gymName = gym.name;
            break;
          }
        }

        await queryClient.cancelQueries({ queryKey: meQueryKey });
        const previous = queryClient.getQueryData(meQueryKey);

        if (gymName) {
          queryClient.setQueryData(meQueryKey, (old: unknown) => {
            const prev = old as { payload?: Record<string, unknown> } | null;
            if (!prev?.payload) return old;
            const now = new Date();
            return {
              ...prev,
              payload: {
                ...prev.payload,
                activeCheckIn: {
                  id: "optimistic",
                  gymId,
                  gymName,
                  startedAt: now.toISOString(),
                  endsAt: new Date(now.getTime() + 240 * 60_000).toISOString(),
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
        queryClient.setQueryData(meQueryKey, (old: unknown) => {
          const prev = old as { payload?: Record<string, unknown> } | null;
          if (!prev?.payload) return old;
          return { ...prev, payload: { ...prev.payload, activeCheckIn: null } };
        });
        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(meQueryKey, context.previous);
        }
        toast.error("체크아웃에 실패했습니다.");
      },
      onSuccess: (data) => {
        void queryClient.invalidateQueries({ queryKey: meQueryKey });
        invalidateGymListQueries();
        const createdId = extractCheckoutCreatedSessionId(data);
        if (createdId) {
          toast.success("체크아웃했어요", {
            description: "방문 기록이 만들어졌어요.",
            action: {
              label: "기록 수정",
              onClick: () =>
                router.push(ROUTES.RECORDS.DETAIL.EDIT.path(createdId)),
            },
          });
        } else {
          toast.success("체크아웃했어요.");
        }
      },
    },
  );

  return { checkInMutation, checkOutMutation };
};

export default useGymCheckInMutations;
