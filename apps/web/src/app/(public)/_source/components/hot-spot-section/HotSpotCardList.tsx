"use client";

import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { gymDistrictLine } from "#web/libs/gym/gymDistrictLine";

const HotSpotCardList: React.FC = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms",
    { params: { query: { sort: "monthlyCheckInCount", limit: 3 } } },
    { select: (d) => d.payload },
  );
  const hotGyms = data?.items ?? [];
  const [hero, ...rest] = hotGyms;

  return (
    <div className="grid grid-cols-2 gap-4">
      {hero && (
        <Link
          href={ROUTES.GYMS.DETAIL.path(hero.id)}
          className="relative col-span-2 flex items-center overflow-hidden rounded-lg border border-white/5 bg-surface-container-low p-6"
        >
          <div className="z-10 flex max-w-[65%] flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 animate-ping rounded-full bg-tertiary" />
              <span className="text-xs font-bold tracking-widest text-tertiary uppercase">
                Hot Spot
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">{hero.name}</h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              현재 <b>{hero.visitorCount}명</b>이 운동 중이에요.
              <br />
              이번 달 누적 방문수가 <b>{hero.monthlyCheckInCount ?? 0}회</b>인
              암장이에요.
            </p>
          </div>
          <div className="absolute -top-5 -right-5 size-48 rounded-full bg-primary/10 blur-3xl" />
          <TrendingUp
            className="pointer-events-none absolute right-6 size-18 text-primary/10"
            strokeWidth={1.25}
            aria-hidden
          />
        </Link>
      )}

      {rest.map((gym) => (
        <Link
          key={gym.id}
          href={ROUTES.GYMS.DETAIL.path(gym.id)}
          className="flex flex-col gap-1 rounded-lg border border-white/5 bg-surface-container-high p-4 transition-colors hover:bg-surface-container"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-on-surface">{gym.name}</h4>
            <span className="flex items-center gap-0.5 text-xs font-bold text-tertiary">
              <Star
                className="size-3 shrink-0 fill-tertiary text-tertiary"
                strokeWidth={2}
                aria-hidden
              />
              {gym.avgRating.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-on-surface-variant">
              {gymDistrictLine(gym.region, gym.address)}
            </p>
            <p className="text-[11px] text-on-surface-variant/80">
              현재 {gym.visitorCount}명 · 이번 달 {gym.monthlyCheckInCount ?? 0}
              회
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HotSpotCardList;
