"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import useMe from "#web/hooks/useMe";
import { createClient } from "#web/libs/supabase/client";
import { cn } from "#web/libs/utils";

interface IProps {
  gymId: string;
  hasActiveCheckIn: boolean;
  className?: string;
}

/** 암장 상세 하단 고정 — 체크인·아웃 */
const GymCheckInBar: React.FC<IProps> = ({
  gymId,
  hasActiveCheckIn,
  className,
}) => {
  const { me } = useMe();
  const isLoggedIn = Boolean(me);

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { queryKey: meQueryKey } = openapi.queryOptions(
    "get",
    "/api/v1/users/me",
  );

  /** 이 암장이 아닌 곳에서 이미 체크인 중 */
  const checkInBlockedElsewhere = Boolean(
    me?.activeCheckIn && me.activeCheckIn.gymId !== gymId,
  );

  const invalidateAfterCheckInOut = () => {
    void queryClient.invalidateQueries(
      openapi.queryOptions("get", "/api/v1/gyms/{gymId}", {
        params: { path: { gymId } },
      }),
    );
    void queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/gyms"],
    });
    void queryClient.invalidateQueries({ queryKey: meQueryKey });
  };

  const checkInMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-in",
    {
      onSuccess: () => {
        invalidateAfterCheckInOut();
        router.refresh();
      },
    },
  );

  const checkOutMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-out",
    {
      onSuccess: () => {
        invalidateAfterCheckInOut();
        router.refresh();
      },
    },
  );

  const goLogin = () => {
    router.push(
      `/login?callbackUrl=${encodeURIComponent(pathname ?? ROUTES.GYMS.DETAIL.path(gymId))}`,
    );
  };

  const primaryLoading =
    checkInMutation.isPending || checkOutMutation.isPending;

  const handleCheckOut = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        goLogin();
        return;
      }
      checkOutMutation.mutate({
        params: { path: { gymId } },
      });
    } catch {
      toast.error("체크아웃에 실패했습니다.");
    }
  };

  const handleCheckIn = async () => {
    if (!isLoggedIn) {
      return toast.error("로그인 후 이용할 수 있습니다.");
    }
    if (checkInBlockedElsewhere) {
      return toast.message(
        "다른 암장에서 체크인 중이에요. 먼저 체크아웃해 주세요.",
      );
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        goLogin();
        return;
      }
      checkInMutation.mutate({ params: { path: { gymId } } });
    } catch {
      toast.error("체크인에 실패했습니다.");
    }
  };

  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-30 border-t border-white/5 bg-surface/95 px-2.5 pt-4 backdrop-blur-xl max-lg:max-w-none",
        "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        {checkInBlockedElsewhere && me?.activeCheckIn ? (
          <p className="mb-2 px-1 text-center text-xs leading-snug text-on-surface-variant">
            <span className="font-semibold text-on-surface">
              {me.activeCheckIn.gymName}
            </span>
            에서 체크인 중이에요. 먼저 해당 암장에서 체크아웃한 뒤 여기서 체크인할
            수 있어요.
          </p>
        ) : null}
        {hasActiveCheckIn ? (
          <button
            type="button"
            disabled={primaryLoading}
            onClick={handleCheckOut}
            className="flex h-14 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-surface-container-high font-bold text-on-surface shadow-md transition-all active:scale-95 disabled:opacity-60"
          >
            <LogOut className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            체크아웃하기
          </button>
        ) : (
          <button
            type="button"
            disabled={primaryLoading || checkInBlockedElsewhere}
            title={
              checkInBlockedElsewhere
                ? "다른 암장에서 체크인 중입니다"
                : undefined
            }
            onClick={handleCheckIn}
            className="flex h-14 w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary/35 bg-primary/12 text-base font-semibold text-primary transition-colors hover:bg-primary/18 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            지금 체크인하기
          </button>
        )}
      </div>
    </div>
  );
};

export default GymCheckInBar;
