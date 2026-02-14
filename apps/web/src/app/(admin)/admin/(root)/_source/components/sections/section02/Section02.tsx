"use client";

import * as React from "react";
import Section02Card from "./Section02-Card";
import {
  useSuspenseGymCount,
  useSuspenseProfileCount,
  useSuspenseCommunityPostCount,
  useSuspenseReportCount,
  useSuspenseGymCountThisWeek,
  useSuspenseProfileCountThisWeek,
  useSuspenseCommunityPostCountThisWeek,
} from "#/src/hooks/queries/use-admin-stats";

const Section02: React.FC = () => {
  // 전체 개수
  const { data: gymCount } = useSuspenseGymCount();
  const { data: profileCount } = useSuspenseProfileCount();
  const { data: communityPostCount } = useSuspenseCommunityPostCount();
  const { data: reportCount } = useSuspenseReportCount();

  // 이번주 개수
  const { data: gymCountThisWeek } = useSuspenseGymCountThisWeek();
  const { data: profileCountThisWeek } = useSuspenseProfileCountThisWeek();
  const { data: communityPostCountThisWeek } =
    useSuspenseCommunityPostCountThisWeek();

  const lists = [
    {
      type: "gym",
      allCount: gymCount,
      thisWeekCount: gymCountThisWeek,
    },
    {
      type: "profile",
      allCount: profileCount,
      thisWeekCount: profileCountThisWeek,
    },
    {
      type: "communityPost",
      allCount: communityPostCount,
      thisWeekCount: communityPostCountThisWeek,
    },
    {
      type: "report",
      allCount: reportCount,
      thisWeekCount: 0,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {lists.map((list) => (
        <Section02Card key={list.type} {...list} />
      ))}
    </div>
  );
};

export default Section02;
