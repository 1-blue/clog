import { Mountain } from "lucide-react";

import type { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import {
  getGymOpenNowStatus,
  TGymOpenNowStatus,
} from "#web/libs/gym/openHours";

type TGymDetail = components["schemas"]["GymDetail"];

const getBadge = (openStatus: TGymOpenNowStatus) => {
  const badgeOpenClass =
    "mb-3 border-secondary bg-secondary/15 font-bold tracking-wide text-secondary backdrop-blur-sm [a]:hover:bg-secondary/15 [a]:hover:text-secondary";

  const badgeClosedClass =
    "mb-3 border-muted-foreground/55 bg-black/30 font-bold tracking-wide text-muted-foreground backdrop-blur-sm [a]:hover:bg-black/30 [a]:hover:text-muted-foreground";

  const badgeUnknownClass =
    "mb-3 border-tertiary/50 bg-tertiary/10 font-bold tracking-wide text-tertiary backdrop-blur-sm [a]:hover:bg-tertiary/10 [a]:hover:text-tertiary";

  return openStatus === "open" ? (
    <Badge variant="outline" className={badgeOpenClass}>
      영업 중
    </Badge>
  ) : openStatus === "closed" ? (
    <Badge variant="outline" className={badgeClosedClass}>
      영업 종료
    </Badge>
  ) : (
    <Badge variant="outline" className={badgeUnknownClass}>
      영업시간 확인
    </Badge>
  );
};

interface IProps {
  gym: TGymDetail;
}

const GymHeroSection: React.FC<IProps> = ({ gym }) => {
  const coverUrl = gym.coverImageUrl;
  const logoUrl = gym.logoImageUrl;
  const openStatus = getGymOpenNowStatus(gym.openHours);
  const badge = getBadge(openStatus);

  return (
    <section className="relative -mx-2.5 -mt-14 h-[min(440px,55vh)] w-[calc(100%+1.25rem)] overflow-hidden bg-surface-container-high">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={gym.name}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Mountain
            className="size-20 text-on-surface-variant"
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      )}
      <div className="kinetic-gradient pointer-events-none absolute inset-0" />
      <div className="absolute right-6 bottom-8 left-6 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          {badge}
          <h1 className="text-3xl font-extrabold tracking-tighter break-keep text-white uppercase sm:text-4xl">
            {gym.name}
          </h1>
        </div>
        {logoUrl ? (
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-surface-container-highest/50 shadow-2xl backdrop-blur-md">
            <img
              src={logoUrl}
              alt={`${gym.name} 로고`}
              className="size-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default GymHeroSection;
