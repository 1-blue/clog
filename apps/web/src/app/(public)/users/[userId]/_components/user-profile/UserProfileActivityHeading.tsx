"use client";

const UserProfileActivityHeading = () => {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h3 className="text-lg font-semibold text-on-surface">활동 기록</h3>
      <span className="text-xs text-on-surface-variant">최근 6개월</span>
    </div>
  );
};

export default UserProfileActivityHeading;
