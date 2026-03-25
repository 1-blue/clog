"use client";

import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";

import type { Region } from "@clog/utils";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { gymDistrictLine } from "#web/libs/gym/gymDistrictLine";

/** 스티치「홈 피드」— 인기 클라이밍장 (핫스팟 히어로 + 2열 카드) */
const HotSpotSection = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms",
    { params: { query: { sort: "reviewCount", limit: 3 } } },
    { select: (d) => d.payload },
  );
  const hotGyms = data?.items ?? [];
  const [hero, ...rest] = hotGyms;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-lg font-bold text-on-surface">
          인기 클라이밍장
        </h2>
        <Link
          href={ROUTES.GYMS.path}
          className="pb-0.5 text-xs text-outline hover:text-primary"
        >
          전체보기
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {hero ? (
          <Link
            href={ROUTES.GYMS.DETAIL.path(hero.id)}
            className="relative col-span-2 flex items-center overflow-hidden rounded-lg border border-white/5 bg-surface-container-low px-6 py-8"
          >
            <div className="z-10 max-w-[65%]">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-1.5 animate-ping rounded-full bg-tertiary" />
                <span className="text-xs font-bold tracking-widest text-tertiary uppercase">
                  Hot Spot
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-on-surface">
                {hero.name}
              </h3>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                세팅 주기에 맞춰 가장 많은 완등 기록이 올라오고 있어요.
              </p>
            </div>
            <div className="absolute -right-5 -top-5 size-48 rounded-full bg-primary/10 blur-3xl" />
            <TrendingUp
              className="pointer-events-none absolute right-6 size-18 text-primary/10"
              strokeWidth={1.25}
              aria-hidden
            />
          </Link>
        ) : null}

        {rest.map((gym) => (
          <Link
            key={gym.id}
            href={ROUTES.GYMS.DETAIL.path(gym.id)}
            className="rounded-lg border border-white/5 bg-surface-container-high p-4 transition-colors hover:bg-surface-container"
          >
            <h4 className="mb-1 text-sm font-bold text-on-surface">
              {gym.name}
            </h4>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                {gymDistrictLine(gym.region as Region, gym.address)}
              </p>
              <span className="flex items-center gap-0.5 text-xs font-bold text-tertiary">
                <Star
                  className="size-3 shrink-0 fill-tertiary text-tertiary"
                  strokeWidth={2}
                  aria-hidden
                />
                {gym.avgRating.toFixed(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {hotGyms.length === 0 && (
        <p className="py-6 text-center text-sm text-on-surface-variant">
          등록된 암장이 없습니다
        </p>
      )}
    </section>
  );
};

export default HotSpotSection;
