"use client";

import TopBar from "#web/components/layout/TopBar";

interface IProps {
  title: string;
}

const GymReviewTopBar: React.FC<IProps> = ({ title }) => {
  return (
    <TopBar
      showNotification={false}
      className="sticky top-0 z-40 mx-0 border-b border-outline-variant bg-surface-container/80 backdrop-blur-xl"
      title={title}
    />
  );
};

export default GymReviewTopBar;
