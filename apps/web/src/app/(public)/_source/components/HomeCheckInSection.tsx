"use client";

import { LogIn, MapPin } from "lucide-react";
import { useState } from "react";

import { openapi } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";
import { Input } from "#web/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import useGymCheckInMutations from "#web/hooks/mutations/gyms/useGymCheckInMutations";
import useMe from "#web/hooks/useMe";

/** 홈 상단 — 로그인 유저 전용 빠른 체크인 섹션 */
const HomeCheckInSection = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { me } = useMe();
  const { checkInMutation } = useGymCheckInMutations({
    onCheckInSuccess: () => setOpen(false),
  });

  const { data: gymData } = openapi.useQuery(
    "get",
    "/api/v1/gyms",
    { params: { query: { search: search || undefined, limit: 20 } } },
    { enabled: open },
  );

  if (!me) return null;
  if (me.activeCheckIn) return null;

  const gymPayload = gymData?.payload;
  const gyms = gymPayload && "items" in gymPayload ? gymPayload.items : [];

  const handleCheckIn = (gymId: string) => {
    checkInMutation.mutate({ params: { path: { gymId } } });
  };

  return (
    <>
      <div className="rounded-2xl bg-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <span className="text-sm font-medium text-on-surface">
              오늘 클라이밍 하러 가시나요?
            </span>
          </div>
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1">
            <LogIn className="size-4" />
            체크인
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[70vh]">
          <SheetHeader>
            <SheetTitle>암장 선택</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Input
              placeholder="암장 이름으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {gyms.length === 0 && (
                <p className="py-8 text-center text-sm text-on-surface-variant">
                  {search
                    ? "검색 결과가 없습니다."
                    : "암장 목록을 불러오는 중…"}
                </p>
              )}
              {gyms.map((gym) => (
                <button
                  key={gym.id}
                  type="button"
                  disabled={checkInMutation.isPending}
                  onClick={() => handleCheckIn(gym.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface-container-high disabled:opacity-50"
                >
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {gym.name}
                    </p>
                    {gym.address && (
                      <p className="truncate text-xs text-on-surface-variant">
                        {gym.address}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HomeCheckInSection;
