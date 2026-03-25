"use client";

import { formatProfileCount } from "#web/libs/format/formatProfileCount";
import { cn } from "#web/libs/utils";

interface IProps {
  visitCount: number;
  sendCount: number;
  followerCount: number;
  followingCount: number;
}

const UserProfileStatsGrid = ({
  visitCount,
  sendCount,
  followerCount,
  followingCount,
}: IProps) => {
  const rows = [
    ["방문", visitCount, "text-primary"],
    ["완등", sendCount, "text-secondary"],
    ["팔로워", followerCount, "text-on-surface"],
    ["팔로잉", followingCount, "text-on-surface"],
  ] as const;

  return (
    <section className="px-6">
      <div className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline-variant/40">
        <div className="grid grid-cols-4 gap-2">
          {rows.map(([label, value, color]) => (
            <div key={label} className="text-center">
              <p className="mb-1 text-xs font-medium text-on-surface-variant">
                {label}
              </p>
              <p className={cn("text-xl font-bold", color)}>
                {formatProfileCount(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserProfileStatsGrid;
