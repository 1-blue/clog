import { Clock, MapPin } from "lucide-react";

import type { components } from "#web/@types/openapi";
import { parseOpenHoursLines } from "#web/libs/gym/openHours";

type TGymDetail = components["schemas"]["GymDetail"];

interface IProps {
  gym: TGymDetail;
}

const GymBasicInfoSection: React.FC<IProps> = ({ gym }) => {
  const hoursLines = parseOpenHoursLines(gym.openHours);

  return (
    <section className="space-y-6 px-6 py-8">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
          <MapPin
            className="size-5"
            fill="currentColor"
            stroke="none"
            aria-hidden
          />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">
            위치
          </p>
          <p className="text-base leading-relaxed font-semibold text-on-surface">
            {gym.address}
          </p>
        </div>
      </div>

      {hoursLines.length > 0 ? (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <Clock className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              운영 시간
            </p>
            <ul className="space-y-1 text-base font-semibold text-on-surface">
              {hoursLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default GymBasicInfoSection;
