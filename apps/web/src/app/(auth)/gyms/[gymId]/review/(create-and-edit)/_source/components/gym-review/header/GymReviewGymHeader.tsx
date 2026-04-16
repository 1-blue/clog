"use client";

import { MapPin } from "lucide-react";

import { regionToKoreanMap, type Region } from "@clog/contracts";

import type { components } from "#web/@types/openapi";

type TGymDetail = components["schemas"]["GymDetail"];

interface IProps {
  gym: TGymDetail;
}

const GymReviewGymHeader = ({ gym }: IProps) => {
  const regionLabel = regionToKoreanMap[gym.region as Region];
  const regionLine = `${regionLabel}, 대한민국`;

  return (
    <section className="rounded-2xl bg-surface-container-low px-4 py-5">
      <p className="text-center text-xs font-medium text-on-surface-variant">
        {regionLine}
      </p>
      <h2 className="mt-1 text-center text-xl leading-snug font-bold text-on-surface">
        {gym.name}
      </h2>
      <div className="mt-3 flex items-start justify-center gap-1.5 text-center text-sm text-on-surface-variant">
        <MapPin
          className="mt-0.5 size-4 shrink-0 text-primary"
          strokeWidth={2}
          aria-hidden
        />
        <span className="leading-snug">{gym.address}</span>
      </div>
    </section>
  );
};

export default GymReviewGymHeader;
