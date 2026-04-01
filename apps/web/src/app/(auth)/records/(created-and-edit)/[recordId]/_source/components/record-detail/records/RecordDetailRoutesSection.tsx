"use client";

import type { components } from "#web/@types/openapi";
import type { TGymDifficultyColor } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";

import RecordDetailRouteRow from "./RecordDetailRouteRow";

type Route = components["schemas"]["Route"];

interface IProps {
  routes: Route[];
  difficultyColors?: TGymDifficultyColor[];
}

const RecordDetailRoutesSection: React.FC<IProps> = ({
  routes,
  difficultyColors,
}) => (
  <section id="record-detail-routes" className="flex flex-col gap-2.5">
    <div className="flex items-end justify-between gap-2">
      <h2 className="text-xl leading-tight font-bold text-on-surface">
        오늘의 완등 기록
      </h2>
      <span className="shrink-0 text-sm font-medium text-on-surface-variant">
        총 {routes.length}개
      </span>
    </div>
    <div className="flex flex-col gap-2.5">
      {routes.map((route) => (
        <RecordDetailRouteRow
          key={route.id}
          route={route}
          difficultyColors={difficultyColors}
        />
      ))}
    </div>
  </section>
);

export default RecordDetailRoutesSection;
