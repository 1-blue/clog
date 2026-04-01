"use client";

import { LogOut, MapPin } from "lucide-react";
import React from "react";

import { Button } from "#web/components/ui/button";
import useGymCheckInMutations from "#web/hooks/mutations/gyms/useGymCheckInMutations";
import useMe from "#web/hooks/useMe";

/** 활성 체크인이 있을 때 하단 네비 위에 표시되는 배너 */
const CheckInStatusBanner = () => {
  const { me } = useMe();
  const { checkOutMutation } = useGymCheckInMutations();

  const activeCheckIn = me?.activeCheckIn;
  if (!activeCheckIn) return null;

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
          disabled={checkOutMutation.isPending}
          onClick={() =>
            checkOutMutation.mutate({
              params: { path: { gymId: activeCheckIn.gymId } },
            })
          }
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
