import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { LogIn } from "lucide-react";

import { cn } from "#web/libs/utils";

interface IProps {
  endsAt: string;
  className?: string;
}

/** 체크인 유지 중일 때 퇴장 예정 시각 안내 */
const GymCheckInStatusBanner: React.FC<IProps> = ({ endsAt, className }) => {
  const end = new Date(endsAt);
  const label = format(end, "M월 d일 HH:mm", { locale: ko });

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm text-primary",
        className,
      )}
      role="status"
    >
      <LogIn className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      <span>
        <span className="font-semibold">체크인 중</span>
        <span className="text-on-surface-variant"> · </span>
        <span className="text-on-surface">{label}</span>
        <span className="text-on-surface-variant">까지</span>
      </span>
    </div>
  );
};

export default GymCheckInStatusBanner;
