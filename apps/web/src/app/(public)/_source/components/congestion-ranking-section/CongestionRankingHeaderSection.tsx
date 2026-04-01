import { formatKoreaTimeHm } from "#web/libs/date/korea";

const CongestionRankingHeaderSection: React.FC = () => {
  const timeLabel = formatKoreaTimeHm(new Date());

  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-on-surface">
          실시간 혼잡도 순위
        </h2>
        <p className="text-xs text-on-surface-variant">
          지금 바로 운동하기 좋은 곳은?
        </p>
      </div>
      <span className="text-xs text-outline">{timeLabel} 기준</span>
    </div>
  );
};

export default CongestionRankingHeaderSection;
