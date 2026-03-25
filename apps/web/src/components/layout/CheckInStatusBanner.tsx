"use client";

import { LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { fetchClient, openapi } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";

/** 활성 체크인이 있을 때 하단 네비 위에 표시되는 배너 */
const CheckInStatusBanner = () => {
  const router = useRouter();

  const { data } = openapi.useQuery("get", "/api/v1/users/me", undefined, {
    retry: false,
    staleTime: 30_000,
  });

  const activeCheckIn = data?.payload?.activeCheckIn;
  if (!activeCheckIn) return null;

  const handleCheckOut = async () => {
    try {
      const { error } = await fetchClient.POST(
        "/api/v1/gyms/{gymId}/check-out",
        { params: { path: { gymId: activeCheckIn.gymId } } },
      );
      if (error) {
        toast.error("체크아웃에 실패했습니다.");
        return;
      }
      toast.success("체크아웃했어요.");
      router.refresh();
    } catch {
      toast.error("체크아웃에 실패했습니다.");
    }
  };

  return (
    <div className="fixed right-0 bottom-16 left-0 z-40 border-t border-outline-variant bg-primary/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-primary" />
          <span className="font-medium text-on-surface">
            {activeCheckIn.gymName}
          </span>
          <span className="text-xs text-on-surface-variant">체크인 중</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCheckOut}
          className="gap-1 text-xs text-primary"
        >
          <LogOut className="size-3.5" />
          체크아웃
        </Button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};
export default CheckInStatusBanner;
