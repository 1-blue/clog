import { Metadata } from "next";

import TopBar from "#web/components/layout/TopBar";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import StatisticsMain from "./_source/StatisticsMain";

export const metadata: Metadata = getSharedMetadata({
  title: "통계",
});

const StatisticsPage: React.FC = () => {
  return (
    <div className="">
      <TopBar title="통계" />
      <div className="mt-4">
        <StatisticsMain />
      </div>
    </div>
  );
};

export default StatisticsPage;
