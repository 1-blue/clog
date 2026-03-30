import { Mountain, Star } from "lucide-react";
import React from "react";
import Link from "next/link";

import { ROUTES } from "#web/constants";

import CongestionBadge from "./CongestionBadge";

interface IProps {
  id: string;
  name: string;
  address: string;
  visitorCount: number;
  avgRating: number;
  reviewCount: number;
  imageUrl?: string | null;
}

const GymCard: React.FC<IProps> = ({
  id,
  name,
  address,
  visitorCount,
  avgRating,
  reviewCount,
  imageUrl,
}) => {
  // visitorCount 기준: ~20 여유 / 21~40 보통 / 41~ 혼잡
  const visitorLevel = visitorCount <= 20 ? 0 : visitorCount <= 40 ? 45 : 75;

  return (
    <Link
      href={ROUTES.GYMS.DETAIL.path(id)}
      className="flex gap-3 rounded-2xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
    >
      {/* 썸네일 */}
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-surface-container-high">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="size-full object-cover" />
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
            <h3 className="font-semibold text-on-surface">{name}</h3>
            <CongestionBadge level={visitorLevel} />
            <span className="text-xs text-on-surface-variant">
              {visitorCount}명
            </span>
          </div>
          <p className="mt-0.5 text-xs text-on-surface-variant">{address}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Star className="size-3.5 fill-tertiary text-tertiary" />
          <span>{avgRating.toFixed(1)}</span>
          <span>({reviewCount})</span>
        </div>
      </div>
    </Link>
  );
};
export default GymCard;
