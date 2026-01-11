"use client";

import { use } from "react";
import type { Database } from "@clog/db";
import { Building2, MessageCircle, User, Flag } from "lucide-react";
import { cn } from "@clog/libs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#/src/components/ui/tabs";
import { SupabaseQueryResponse } from "#/src/types";
import {
  formatDistanceToNow,
  compareDesc,
  format,
  differenceInDays,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";

type Gym = Database["public"]["Tables"]["gyms"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CommunityPost = Database["public"]["Tables"]["community_posts"]["Row"];
type Report = Database["public"]["Tables"]["reports"]["Row"];

interface RecentActivitiesProps {
  promiseGyms: Promise<SupabaseQueryResponse<Gym[]>>;
  promiseProfiles: Promise<SupabaseQueryResponse<Profile[]>>;
  promiseCommunityPosts: Promise<SupabaseQueryResponse<CommunityPost[]>>;
  promiseReports: Promise<SupabaseQueryResponse<Report[]>>;
}

// 시간 포맷 함수
const formatTime = (timestamp: string) => {
  const date = parseISO(timestamp);
  const now = new Date();
  const diffDays = differenceInDays(now, date);

  // 7일 이내는 상대 시간 표시
  if (diffDays < 7) {
    const formatted = formatDistanceToNow(date, {
      addSuffix: true,
      locale: ko,
    });
    // "약" 제거하고 "전" 앞에 공백 제거
    return formatted.replace(/약\s*/, "").replace(/\s*전/, " 전");
  }

  // 7일 이상은 날짜 표시
  return format(date, "yyyy. M. d", { locale: ko });
};

const Section04: React.FC<RecentActivitiesProps> = ({
  promiseGyms,
  promiseProfiles,
  promiseCommunityPosts,
  promiseReports,
}) => {
  const resultGyms = use(promiseGyms);
  const resultProfiles = use(promiseProfiles);
  const resultCommunityPosts = use(promiseCommunityPosts);
  const resultReports = use(promiseReports);

  // 암장 활동 목록 생성 (등록, 수정)
  const gymActivities: Array<{
    id: string;
    message: string;
    detail: string;
    timestamp: string;
    action: "created" | "updated";
  }> = [];

  if (resultGyms.data) {
    resultGyms.data.forEach((gym) => {
      if (gym.created_at) {
        gymActivities.push({
          id: gym.id,
          message: "새로운 암장이 등록되었습니다",
          detail: gym.name || "이름 없음",
          timestamp: gym.created_at,
          action: "created",
        });
      }
      if (
        gym.updated_at &&
        gym.created_at &&
        gym.updated_at !== gym.created_at
      ) {
        gymActivities.push({
          id: `${gym.id}-updated`,
          message: "암장 정보가 수정되었습니다",
          detail: gym.name || "이름 없음",
          timestamp: gym.updated_at,
          action: "updated",
        });
      }
    });
  }

  // 프로필 활동 목록 생성 (회원가입)
  const profileActivities: Array<{
    id: string;
    message: string;
    detail: string;
    timestamp: string;
  }> = [];

  if (resultProfiles.data) {
    resultProfiles.data.forEach((profile) => {
      if (profile.created_at) {
        profileActivities.push({
          id: profile.id,
          message: "신규 사용자가 가입했습니다",
          detail: profile.nickname || "이름 없음",
          timestamp: profile.created_at,
        });
      }
    });
  }

  // 게시글 활동 목록 생성 (작성, 수정)
  const communityPostActivities: Array<{
    id: string;
    message: string;
    detail: string;
    timestamp: string;
    action: "created" | "updated";
  }> = [];

  if (resultCommunityPosts.data) {
    resultCommunityPosts.data.forEach((post) => {
      if (post.created_at) {
        communityPostActivities.push({
          id: post.id,
          message: "새로운 게시글이 작성되었습니다",
          detail: post.title || "제목 없음",
          timestamp: post.created_at,
          action: "created",
        });
      }
      if (
        post.updated_at &&
        post.created_at &&
        post.updated_at !== post.created_at
      ) {
        communityPostActivities.push({
          id: `${post.id}-updated`,
          message: "게시글이 수정되었습니다",
          detail: post.title || "제목 없음",
          timestamp: post.updated_at,
          action: "updated",
        });
      }
    });
  }

  // 신고 활동 목록 생성 (신고 접수)
  const reportActivities: Array<{
    id: string;
    message: string;
    detail: string;
    timestamp: string;
  }> = [];

  if (resultReports.data) {
    resultReports.data.forEach((report) => {
      if (report.created_at) {
        reportActivities.push({
          id: report.id,
          message: "부적절한 게시글이 신고되었습니다",
          detail: report.reason || "사유 없음",
          timestamp: report.created_at,
        });
      }
    });
  }

  // 시간순 정렬 (최신순)
  const sortedGymActivities = gymActivities
    .sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)))
    .slice(0, 10);
  const sortedProfileActivities = profileActivities
    .sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)))
    .slice(0, 10);
  const sortedCommunityPostActivities = communityPostActivities
    .sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)))
    .slice(0, 10);
  const sortedReportActivities = reportActivities
    .sort((a, b) => compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)))
    .slice(0, 10);

  // 활동 카드 컴포넌트
  const ActivityCard = ({
    icon: Icon,
    bgColor,
    iconColor,
    message,
    detail,
    time,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    iconColor: string;
    message: string;
    detail: string;
    time: string;
  }) => {
    return (
      <div className={cn("flex items-start gap-3 rounded-lg p-4", bgColor)}>
        <div className={cn("shrink-0 rounded-lg bg-white p-2", iconColor)}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{message}</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-sm text-gray-600">{detail}</div>
            <div className="shrink-0 text-xs text-gray-500">{time}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">최근 활동</h2>
      <Tabs defaultValue="gym">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gym">암장</TabsTrigger>
          <TabsTrigger value="profile">사용자</TabsTrigger>
          <TabsTrigger value="communityPost">게시글</TabsTrigger>
          <TabsTrigger value="report">신고</TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="mt-4">
          <div className="flex flex-col gap-3">
            {sortedGymActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                암장 활동 내역이 없습니다.
              </div>
            ) : (
              sortedGymActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  icon={Building2}
                  bgColor="bg-blue-100"
                  iconColor="text-blue-600"
                  message={activity.message}
                  detail={activity.detail}
                  time={formatTime(activity.timestamp)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <div className="flex flex-col gap-3">
            {sortedProfileActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                사용자 활동 내역이 없습니다.
              </div>
            ) : (
              sortedProfileActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  icon={User}
                  bgColor="bg-green-100"
                  iconColor="text-green-600"
                  message={activity.message}
                  detail={activity.detail}
                  time={formatTime(activity.timestamp)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="communityPost" className="mt-4">
          <div className="flex flex-col gap-3">
            {sortedCommunityPostActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                게시글 활동 내역이 없습니다.
              </div>
            ) : (
              sortedCommunityPostActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  icon={MessageCircle}
                  bgColor="bg-purple-100"
                  iconColor="text-purple-600"
                  message={activity.message}
                  detail={activity.detail}
                  time={formatTime(activity.timestamp)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <div className="flex flex-col gap-3">
            {sortedReportActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                신고 활동 내역이 없습니다.
              </div>
            ) : (
              sortedReportActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  icon={Flag}
                  bgColor="bg-red-100"
                  iconColor="text-red-600"
                  message={activity.message}
                  detail={activity.detail}
                  time={formatTime(activity.timestamp)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Section04;
