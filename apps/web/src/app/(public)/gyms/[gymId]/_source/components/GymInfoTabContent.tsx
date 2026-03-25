import { Phone, Star } from "lucide-react";

import type { FacilityType } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import FacilityChip from "#web/components/gym/FacilityChip";
import GymMapActionBar from "#web/components/gym/GymMapActionBar";
import KakaoMapEmbed from "#web/components/gym/KakaoMapEmbed";
import { cn } from "#web/libs/utils";

type TGymDetail = components["schemas"]["GymDetail"];

interface IProps {
  gym: TGymDetail;
}

const GymInfoTabContent: React.FC<IProps> = ({ gym }) => {
  const hasCoords = gym.latitude != null && gym.longitude != null;

  return (
    <section className="space-y-8 px-6 py-8">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-5 text-tertiary",
                i < Math.round(gym.avgRating)
                  ? "fill-tertiary"
                  : "fill-none",
              )}
              strokeWidth={2}
              aria-hidden
            />
          ))}
        </div>
        <span className="text-sm font-medium text-on-surface">
          {gym.avgRating.toFixed(1)}
        </span>
        <span className="text-sm text-on-surface-variant">
          ({gym.reviewCount}개 리뷰)
        </span>
      </div>

      {gym.facilities.length > 0 ? (
        <div>
          <h5 className="mb-5 text-xs font-bold tracking-widest text-tertiary uppercase">
            시설
          </h5>
          <div className="flex flex-wrap gap-2.5 rounded-2xl border border-white/5 bg-surface-container-low p-6">
            {gym.facilities.map((f) => (
              <FacilityChip key={f.id} type={f.type as FacilityType} />
            ))}
          </div>
        </div>
      ) : null}

      {gym.phone ? (
        <div>
          <h5 className="mb-2 text-sm font-semibold text-on-surface">
            연락처
          </h5>
          <a
            href={`tel:${gym.phone}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Phone className="size-5" strokeWidth={2} aria-hidden />
            {gym.phone}
          </a>
        </div>
      ) : null}

      {gym.description ? (
        <div>
          <h5 className="mb-2 text-sm font-semibold text-on-surface">
            소개
          </h5>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {gym.description}
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low">
        <div className="relative min-h-80">
          {hasCoords ? (
            <>
              <KakaoMapEmbed
                latitude={gym.latitude!}
                longitude={gym.longitude!}
                className="h-80 min-h-80 w-full"
              />
              <GymMapActionBar
                gymName={gym.name}
                latitude={gym.latitude!}
                longitude={gym.longitude!}
              />
            </>
          ) : (
            <div className="flex h-80 min-h-80 items-center justify-center bg-surface-container-high text-xs text-on-surface-variant">
              위치 좌표가 등록되지 않았습니다
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GymInfoTabContent;
