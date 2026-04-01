"use client";

import { formatYmdLongKorean } from "../profile-heatmap/heatmap-utils";

interface IProps {
  selectedYmd: string | null;
}

const UserProfileSelectionCaption = ({ selectedYmd }: IProps) => {
  return (
    <div className="rounded-xl bg-surface-container-low px-4 py-3 text-center text-sm ring-1 ring-outline-variant/40">
      {selectedYmd ? (
        <p className="leading-relaxed">
          <span className="font-semibold text-on-surface">
            {formatYmdLongKorean(selectedYmd)}
          </span>
          <br />
          <span className="text-on-surface-variant">
            같은 칸을 다시 누르면 전체 목록으로 돌아갑니다.
          </span>
        </p>
      ) : (
        <p className="text-on-surface-variant">
          활동 히트맵에서 날짜를 누르면 그날 공개 기록만 모아서 볼 수 있어요.
        </p>
      )}
    </div>
  );
};

export default UserProfileSelectionCaption;
