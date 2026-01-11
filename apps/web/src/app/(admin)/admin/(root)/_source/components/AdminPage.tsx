import { supabase } from "@clog/db/web";
import Section01 from "./sections/Section01";
import Section02 from "./sections/section02/Section02";
import Section03 from "./sections/Section03";
import Section04 from "./sections/Section04";
import { Suspense } from "react";
import { startOfWeek } from "date-fns/startOfWeek";
import { endOfWeek } from "date-fns/endOfWeek";

const NOW = new Date();

const AdminPage: React.FC = () => {
  // ================================ section 02 ================================
  // 전체 개수
  const promiseGyms = Promise.resolve(
    supabase.from("gyms").select("*", { count: "exact", head: true })
  );
  const promiseProfiles = Promise.resolve(
    supabase.from("profiles").select("*", { count: "exact", head: true })
  );
  const promiseCommunityPosts = Promise.resolve(
    supabase.from("community_posts").select("*", { count: "exact", head: true })
  );
  // 해결되지 않은 신고 (status가 'pending' 또는 'reviewed')
  const promiseReports = Promise.resolve(
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "reviewed"])
  );

  // 이번주 개수
  const weekStart = startOfWeek(NOW, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(NOW, { weekStartsOn: 1 });

  const promiseGymsThisWeek = Promise.resolve(
    supabase
      .from("gyms")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd)
  );
  const promiseProfilesThisWeek = Promise.resolve(
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd)
  );
  const promiseCommunityPostsThisWeek = Promise.resolve(
    supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd)
  );

  // ================================ section 04 ================================
  // 최근 활동 (각 테이블에서 최근 10개씩 가져와서 탭별로 표시)
  const promiseRecentGyms = Promise.resolve(
    supabase
      .from("gyms")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(10)
  );
  const promiseRecentProfiles = Promise.resolve(
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
  );
  const promiseRecentCommunityPosts = Promise.resolve(
    supabase
      .from("community_posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(10)
  );
  const promiseRecentReports = Promise.resolve(
    supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
  );

  return (
    <div className="flex flex-col gap-4">
      <Section01 />

      <Suspense fallback={<div>Loading...</div>}>
        <Section02
          promiseGyms={promiseGyms}
          promiseProfiles={promiseProfiles}
          promiseCommunityPosts={promiseCommunityPosts}
          promiseReports={promiseReports}
          promiseGymsThisWeek={promiseGymsThisWeek}
          promiseProfilesThisWeek={promiseProfilesThisWeek}
          promiseCommunityPostsThisWeek={promiseCommunityPostsThisWeek}
        />
      </Suspense>
      <Section03 />
      <Suspense fallback={<div>Loading...</div>}>
        <Section04
          promiseGyms={promiseRecentGyms}
          promiseProfiles={promiseRecentProfiles}
          promiseCommunityPosts={promiseRecentCommunityPosts}
          promiseReports={promiseRecentReports}
        />
      </Suspense>
    </div>
  );
};

export default AdminPage;
