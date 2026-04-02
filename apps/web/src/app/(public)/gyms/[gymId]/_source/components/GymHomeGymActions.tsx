"use client";

import { toast } from "sonner";

import { openapi } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";

interface IProps {
  gymId: string;
}

/** 로그인 사용자만: 현재 암장을 홈짐으로 설정/해제 */
const GymHomeGymActions: React.FC<IProps> = ({ gymId }) => {
  const { data: me } = openapi.useQuery("get", "/api/v1/users/me", undefined, {
    retry: false,
    select: (d) => d.payload,
  });
  const { updateMeMutation } = useUserMutations();

  if (!me) return null;

  const isHome = me.homeGymId === gymId;

  return (
    <div className="px-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl font-semibold"
        disabled={updateMeMutation.isPending}
        onClick={() => {
          updateMeMutation.mutate(
            { body: { homeGymId: isHome ? null : gymId } },
            {
              onSuccess: () => {
                toast.success(
                  isHome ? "홈짐을 해제했어요." : "홈짐으로 설정했어요.",
                );
              },
              onError: () => toast.error("홈짐 설정에 실패했습니다."),
            },
          );
        }}
      >
        {updateMeMutation.isPending
          ? "처리 중…"
          : isHome
            ? "홈짐 해제"
            : "홈짐으로 설정"}
      </Button>
    </div>
  );
};

export default GymHomeGymActions;
