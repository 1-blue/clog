"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, SquarePen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { createClient } from "#web/libs/supabase/client";
import { cn } from "#web/libs/utils";

interface IProps {
  gymId: string;
  hasActiveCheckIn: boolean;
  className?: string;
}

/** 암장 상세 하단 고정 — 리뷰 작성 / 체크인·아웃 */
const GymCheckInBar: React.FC<IProps> = ({
  gymId,
  hasActiveCheckIn,
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const invalidateGym = () => {
    void queryClient.invalidateQueries(
      openapi.queryOptions("get", "/api/v1/gyms/{gymId}", {
        params: { path: { gymId } },
      }),
    );
    void queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/gyms"],
    });
  };

  const checkInMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-in",
    {
      onSuccess: () => {
        invalidateGym();
        router.refresh();
      },
    },
  );

  const checkOutMutation = openapi.useMutation(
    "post",
    "/api/v1/gyms/{gymId}/check-out",
    {
      onSuccess: () => {
        invalidateGym();
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

  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-30 border-t border-white/5 bg-surface/95 px-4 pt-4 backdrop-blur-xl max-lg:max-w-none",
        "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-2xl gap-3">
        <Link
          href={ROUTES.GYMS.DETAIL.REVIEW.path(gymId)}
          className="hover:bg-surface-variant flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-surface-container-high/50 text-on-surface transition-colors active:scale-95"
          aria-label="리뷰 작성"
        >
          <SquarePen className="size-5" strokeWidth={2} aria-hidden />
        </Link>

        {hasActiveCheckIn ? (
          <button
            type="button"
            disabled={primaryLoading}
            onClick={async () => {
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
            }}
            className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-surface-container-high font-bold text-on-surface shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            <LogOut className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            체크아웃하기
          </button>
        ) : (
          <button
            type="button"
            disabled={primaryLoading}
            onClick={async () => {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) {
                goLogin();
                return;
              }
              checkInMutation.mutate({ params: { path: { gymId } } });
            }}
            className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-base font-bold text-on-primary-container shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"
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
