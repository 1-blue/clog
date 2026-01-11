"use client";

import { SupabaseQueryResponse } from "#/src/types";
import type { Database } from "@clog/db";
import { use } from "react";
import Section02Card from "./Section02-Card";

type Gym = Database["public"]["Tables"]["gyms"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CommunityPost = Database["public"]["Tables"]["community_posts"]["Row"];
type Report = Database["public"]["Tables"]["reports"]["Row"];

interface Section02Props {
  promiseGyms: Promise<SupabaseQueryResponse<Gym[]>>;
  promiseProfiles: Promise<SupabaseQueryResponse<Profile[]>>;
  promiseCommunityPosts: Promise<SupabaseQueryResponse<CommunityPost[]>>;
  promiseReports: Promise<SupabaseQueryResponse<Report[]>>;

  promiseGymsThisWeek: Promise<SupabaseQueryResponse<Gym[]>>;
  promiseProfilesThisWeek: Promise<SupabaseQueryResponse<Profile[]>>;
  promiseCommunityPostsThisWeek: Promise<
    SupabaseQueryResponse<CommunityPost[]>
  >;
}

const Section02: React.FC<Section02Props> = ({
  promiseGyms,
  promiseProfiles,
  promiseCommunityPosts,
  promiseReports,
  promiseGymsThisWeek,
  promiseProfilesThisWeek,
  promiseCommunityPostsThisWeek,
}) => {
  // 전체 개수
  const resultGyms = use(promiseGyms);
  const resultProfiles = use(promiseProfiles);
  const resultCommunityPosts = use(promiseCommunityPosts);
  const resultReports = use(promiseReports);

  // 이번주 개수
  const resultGymsThisWeek = use(promiseGymsThisWeek);
  const resultProfilesThisWeek = use(promiseProfilesThisWeek);
  const resultCommunityPostsThisWeek = use(promiseCommunityPostsThisWeek);

  // 전체 개수
  const gymCount = resultGyms.count ?? 0;
  const profileCount = resultProfiles.count ?? 0;
  const communityPostCount = resultCommunityPosts.count ?? 0;
  const reportCount = resultReports.count ?? 0;

  // 이번주 개수
  const gymCountThisWeek = resultGymsThisWeek.count ?? 0;
  const profileCountThisWeek = resultProfilesThisWeek.count ?? 0;
  const communityPostCountThisWeek = resultCommunityPostsThisWeek.count ?? 0;

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
