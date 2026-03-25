import {
  Car,
  Coffee,
  Dumbbell,
  HandHelping,
  Lock,
  ShowerHead,
  Sofa,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import React from "react";

import type { FacilityType } from "@clog/utils";

const FACILITY_INFO: Record<FacilityType, { icon: LucideIcon; label: string }> =
  {
    PARKING: { icon: Car, label: "주차" },
    SHOWER: { icon: ShowerHead, label: "샤워" },
    LOCKER: { icon: Lock, label: "락커" },
    RENTAL: { icon: HandHelping, label: "대여" },
    CAFE: { icon: Coffee, label: "카페" },
    WIFI: { icon: Wifi, label: "와이파이" },
    REST_AREA: { icon: Sofa, label: "휴게" },
    TRAINING: { icon: Dumbbell, label: "트레이닝" },
  };

interface IProps {
  type: FacilityType;
}

const FacilityChip: React.FC<IProps> = ({ type }) => {
  const info = FACILITY_INFO[type];
  const Icon = info.icon;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 text-xs text-on-surface-variant">
      <Icon className="size-4" />
      {info.label}
    </span>
  );
};
export default FacilityChip;
