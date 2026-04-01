import CongestionRankingCardList from "./CongestionRankingCardList";
import CongestionRankingHeaderSection from "./CongestionRankingHeaderSection";

/** 홈 피드 — 실시간 혼잡도 순위 (인원 수) */
const CongestionRankingSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-4">
      <CongestionRankingHeaderSection />

      <CongestionRankingCardList />
    </section>
  );
};

export default CongestionRankingSection;
