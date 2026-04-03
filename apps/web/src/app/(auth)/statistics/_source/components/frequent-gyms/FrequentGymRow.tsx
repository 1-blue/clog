"use client";

import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants/routes";

type TGym = components["schemas"]["MeStatisticsPayload"]["topGyms"][number];

interface IProps {
  gym: TGym;
}

const FrequentGymRow: React.FC<IProps> = ({ gym }) => {
  return (
    <Link
      href={ROUTES.GYMS.DETAIL.path(gym.gymId)}
      className="flex items-center justify-between rounded-2xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-outline-variant bg-surface-container-high">
          {gym.coverImageUrl ? (
            <img
              src={gym.coverImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-on-surface-variant">
              암장
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-on-surface">
            {gym.name}
          </p>
          <p className="truncate text-[11px] text-on-surface-variant">
            {gym.address}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[9px] font-bold tracking-tighter text-on-surface-variant uppercase">
          총 방문 수
        </p>
        <p className="text-sm font-bold text-primary tabular-nums">
          {gym.visitCount}회
        </p>
      </div>
    </Link>
  );
};

export default FrequentGymRow;
