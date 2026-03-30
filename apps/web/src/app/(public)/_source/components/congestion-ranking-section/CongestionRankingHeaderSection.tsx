import { format } from "date-fns";
import { ko } from "date-fns/locale";

const timeLabel = format(new Date(), "HH:mm", { locale: ko });

const CongestionRankingHeaderSection: React.FC = () => {
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
      <span className="mb-1 text-xs text-outline">{timeLabel} 기준</span>
    </div>
  );
};

export default CongestionRankingHeaderSection;
