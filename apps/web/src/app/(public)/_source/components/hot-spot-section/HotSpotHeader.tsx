import Link from "next/link";

import { ROUTES } from "#web/constants";

const HotSpotHeader: React.FC = () => {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-lg font-bold text-on-surface">인기 클라이밍장</h2>
      <Link
        href={ROUTES.GYMS.path}
        className="pb-0.5 text-xs text-outline hover:text-primary"
      >
        전체보기
      </Link>
    </div>
  );
};

export default HotSpotHeader;
