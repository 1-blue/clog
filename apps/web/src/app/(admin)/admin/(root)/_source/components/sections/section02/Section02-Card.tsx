import { Building2, Flag, MessageCircle, User } from "lucide-react";
import { cn } from "@clog/libs";

/**
 * - `gym`: 암장
 * - `profile`: 사용자
 * - `communityPost`: 커뮤니티 게시글
 * - `report`: 신고
 */
type TCardType = "gym" | "profile" | "communityPost" | "report";

// 타입별 색상 매핑
const colorConfig: Record<
  TCardType,
  {
    bg: string;
    icon: string;
    text: string;
  }
> = {
  gym: {
    bg: "bg-blue-200",
    icon: "text-blue-600",
    text: "text-blue-900",
  },
  profile: {
    bg: "bg-green-200",
    icon: "text-green-600",
    text: "text-green-900",
  },
  communityPost: {
    bg: "bg-purple-200",
    icon: "text-purple-600",
    text: "text-purple-900",
  },
  report: {
    bg: "bg-red-200",
    icon: "text-red-600",
    text: "text-red-900",
  },
};

// 아이콘 컴포넌트 매핑
const iconMap: Record<
  TCardType,
  React.ComponentType<{ className?: string }>
> = {
  gym: Building2,
  profile: User,
  communityPost: MessageCircle,
  report: Flag,
};

// 레이블 매핑
const labelMap: Record<TCardType, string> = {
  gym: "등록된 암장",
  profile: "전체 사용자",
  communityPost: "커뮤니티 게시글",
  report: "대기 중인 신고",
};

interface CardProps {
  type: TCardType;
  allCount: number;
  thisWeekCount: number;
}

const Section02Card: React.FC<CardProps> = ({
  type,
  allCount,
  thisWeekCount,
}) => {
  const colors = colorConfig[type];
  const IconComponent = iconMap[type];

  return (
    <div className="clog-section">
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg p-3",
            colors.bg
          )}
        >
          <IconComponent className={cn("size-6", colors.icon)} />
        </div>
        <div className={cn("text-sm font-bold", colors.text)}>
          이번주 +{thisWeekCount.toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <span className="text-2xl font-bold">{allCount.toLocaleString()}</span>
        <span className="text-sm text-gray-500">{labelMap[type]}</span>
      </div>
    </div>
  );
};

export default Section02Card;
