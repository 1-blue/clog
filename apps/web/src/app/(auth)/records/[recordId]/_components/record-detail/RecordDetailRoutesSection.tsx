"use client";

import type { components } from "#web/@types/openapi";

import RecordDetailRouteRow from "./RecordDetailRouteRow";

type Route = components["schemas"]["Route"];

interface IProps {
  routes: Route[];
  className?: string;
}

const RecordDetailRoutesSection = ({ routes, className }: IProps) => (
  <section id="record-detail-routes" className={className}>
    <div className="mb-4 flex items-end justify-between gap-2">
      <h2 className="text-xl leading-tight font-bold text-on-surface">
        오늘의 완등 기록
      </h2>
      <span className="shrink-0 text-sm font-medium text-on-surface-variant">
        총 {routes.length}개
      </span>
    </div>
    <div className="space-y-2.5">
      {routes.map((route) => (
        <RecordDetailRouteRow key={route.id} route={route} />
      ))}
    </div>
  </section>
);

export default RecordDetailRoutesSection;
