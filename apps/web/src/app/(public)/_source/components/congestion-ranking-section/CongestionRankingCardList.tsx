"use client";

import { openapi } from "#web/apis/openapi";

import CongestionRankingCard from "./CongestionRankingCard";

const CongestionRankingCardList: React.FC = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms",
    { params: { query: { sort: "visitorCount", limit: 5 } } },
    { select: (d) => d.payload },
  );
  const topGyms = data?.items ?? [];
  const maxVisitor = Math.max(1, ...topGyms.map((g) => g.visitorCount));

  return (
    <div className="scrollbar-hide -mx-2 flex gap-4 overflow-x-auto px-2">
      {topGyms.map((gym, i) => (
        <CongestionRankingCard
          key={gym.id}
          index={i}
          gym={gym}
          maxVisitor={maxVisitor}
        />
      ))}
    </div>
  );
};

export default CongestionRankingCardList;
