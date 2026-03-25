"use client";

import { MapPin, Mountain } from "lucide-react";
import Link from "next/link";

import type { Region } from "@clog/utils";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { gymDistrictLine } from "#web/libs/gym/gymDistrictLine";

const nearbySubtitle = (visitorCount: number, congestion: number): string => {
  if (congestion < 40) return "쾌적한 상태";
  return `지금 ${visitorCount}명 운동 중`;
};

/** 스티치「홈 피드」— 내 주변(서울 기준 추천) 가로 스크롤 */
const NearbyGymsSection = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms",
    {
      params: {
        query: { region: "SEOUL", sort: "reviewCount", limit: 8 },
      },
    },
    { select: (d) => d.payload },
  );
  const gyms = data?.items ?? [];

  const locationLabel =
    gyms[0] != null
      ? gymDistrictLine(gyms[0].region as Region, gyms[0].address)
      : "서울";

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">
          내 주변 클라이밍장
        </h2>
        <div className="flex items-center gap-1 text-xs font-medium text-primary">
          <MapPin
            className="size-4 shrink-0 text-on-surface-variant"
            strokeWidth={2}
            aria-hidden
          />
          {locationLabel}
        </div>
      </div>

      <div className="scrollbar-hide -mx-2 flex gap-6 overflow-x-auto px-2">
        {gyms.map((gym) => (
          <Link
            key={gym.id}
            href={ROUTES.GYMS.DETAIL.path(gym.id)}
            className="group w-64 shrink-0"
          >
            <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-surface-container-highest">
              {gym.images[0] ? (
                <img
                  src={gym.images[0].url}
                  alt={gym.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Mountain
                    className="size-10 text-on-surface-variant"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              )}
            </div>
            <div className="space-y-1 px-1">
              <h4 className="text-sm font-bold text-on-surface">{gym.name}</h4>
              <p className="text-xs text-on-surface-variant">
                {nearbySubtitle(gym.visitorCount, gym.congestion)}
              </p>
            </div>
          </Link>
        ))}
        {gyms.length === 0 && (
          <p className="py-6 text-sm text-on-surface-variant">
            주변 암장을 불러올 수 없습니다
          </p>
        )}
      </div>
    </section>
  );
};

export default NearbyGymsSection;
