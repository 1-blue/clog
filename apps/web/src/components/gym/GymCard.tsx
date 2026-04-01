import { Mountain, Star } from "lucide-react";
import React from "react";
import Link from "next/link";

import { regionToKoreanMap } from "@clog/utils";

import { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import { ROUTES } from "#web/constants";
import {
  getGymOpenCloseSoonBadge,
  getGymOpenNowStatus,
} from "#web/libs/gym/openHours";

import CongestionBadge from "./CongestionBadge";

interface IProps {
  gym: components["schemas"]["GymListItem"];
}

const GymCard: React.FC<IProps> = ({ gym }) => {
  const regionLabel = regionToKoreanMap[gym.region] ?? String(gym.region);
  const openStatus = getGymOpenNowStatus(gym.openHours);
  const soon = getGymOpenCloseSoonBadge(gym.openHours);

  return (
    <Link
      href={ROUTES.GYMS.DETAIL.path(gym.id)}
      className="flex gap-3 rounded-2xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
    >
      {/* 썸네일 */}
      <div className="size-20 shrink-0 overflow-hidden rounded-sm bg-surface-container-high">
        {gym.thumbnailUrl ? (
          <img
            src={gym.thumbnailUrl}
            alt={gym.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Mountain className="size-6 text-on-surface-variant" />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-on-surface">{gym.name}</h3>
            <CongestionBadge visitorCount={gym.visitorCount} />
            <span className="text-xs text-on-surface-variant">
              {gym.visitorCount}명
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="font-medium text-on-surface-variant">
              {regionLabel}
            </span>
            <span aria-hidden>·</span>
            <span className="font-medium">
              {openStatus === "open"
                ? "영업 중"
                : openStatus === "closed"
                  ? "영업 종료"
                  : "영업시간 확인중"}
            </span>
            {soon ? (
              <Badge
                variant={soon.type === "closeSoon" ? "destructive" : "outline"}
                color={soon.type === "openSoon" ? "secondary" : undefined}
                className="h-5 px-1.5 text-[10px] font-bold"
              >
                {soon.label}
              </Badge>
            ) : null}
            <span aria-hidden>·</span>
            <span className="font-medium">
              {gym.visitorCount}/{gym.visitorCapacity}명
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Star className="size-3.5 fill-tertiary text-tertiary" />
          <span>{gym.avgRating.toFixed(1)}</span>
          <span>({gym.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
};
export default GymCard;
