import { format } from "date-fns";
import { ko } from "date-fns/locale";

import type { FacilityType } from "@clog/utils";

import RecordGymDifficultyLegend from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymDifficultyLegend";
import type { components } from "#web/@types/openapi";
import FacilityChip from "#web/components/gym/FacilityChip";
import GymMapActionBar from "#web/components/gym/GymMapActionBar";
import KakaoMapEmbed from "#web/components/gym/KakaoMapEmbed";
import { formatGymPriceInfoLines } from "#web/libs/gym/priceInfo";

type TGymDetail = components["schemas"]["GymDetail"];

const sectionTitleClass =
  "mb-2 text-sm font-bold tracking-widest text-tertiary uppercase";

interface IProps {
  gym: TGymDetail;
}

const GymInfoTab: React.FC<IProps> = ({ gym }) => {
  const hasCoords = gym.latitude != null && gym.longitude != null;
  const priceLines = formatGymPriceInfoLines(
    gym.priceInfo as Record<string, unknown> | null | undefined,
  );
  const createdLabel = format(new Date(gym.createdAt), "yyyy.MM.dd", {
    locale: ko,
  });
  const updatedLabel = format(new Date(gym.updatedAt), "yyyy.MM.dd", {
    locale: ko,
  });

  return (
    <section className="flex flex-col gap-6 py-4">
      <RecordGymDifficultyLegend
        difficultyColors={gym.difficultyColors}
        labelClassName={sectionTitleClass}
      />

      {gym.facilities.length > 0 ? (
        <div>
          <h5 className={sectionTitleClass}>시설</h5>
          <div className="flex flex-wrap gap-2.5 rounded-2xl border border-white/5 bg-surface-container-low p-4">
            {gym.facilities.map((f) => (
              <FacilityChip key={f} type={f as FacilityType} />
            ))}
          </div>
        </div>
      ) : null}

      {gym.description ? (
        <div>
          <h5 className={sectionTitleClass}>소개</h5>
          <div className="rounded-2xl border border-white/5 bg-surface-container-low p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-on-surface-variant">
              {gym.description}
            </p>
          </div>
        </div>
      ) : null}

      {priceLines.length > 0 ? (
        <div>
          <h5 className={sectionTitleClass}>요금</h5>
          <ul className="space-y-2 rounded-2xl border border-white/5 bg-surface-container-low p-4">
            {priceLines.map(({ label, value }, i) => (
              <li
                key={`${label}-${i}`}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-on-surface-variant">{label}</span>
                <span className="font-semibold text-on-surface">{value}</span>
              </li>
            ))}
          </ul>
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

      <p className="text-center text-xs text-on-surface-variant">
        등록 {createdLabel}
        {createdLabel !== updatedLabel ? ` · 수정 ${updatedLabel}` : null}
      </p>
    </section>
  );
};

export default GymInfoTab;
