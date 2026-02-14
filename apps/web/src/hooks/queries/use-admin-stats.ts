import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import { startOfWeek, endOfWeek } from "date-fns";

const NOW = new Date();
const weekStart = startOfWeek(NOW, { weekStartsOn: 1 });
const weekEnd = endOfWeek(NOW, { weekStartsOn: 1 });

export const adminStatsKeys = {
  all: ["admin", "stats"] as const,
  counts: () => [...adminStatsKeys.all, "counts"] as const,
  countsThisWeek: () => [...adminStatsKeys.all, "countsThisWeek"] as const,
  recent: () => [...adminStatsKeys.all, "recent"] as const,
};

// ========== 전체 개수 ==========

/** 암장 전체 개수 */
export const useSuspenseGymCount = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.counts(), "gyms"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("gyms")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count ?? 0;
    },
  });
};

/** 프로필 전체 개수 */
export const useSuspenseProfileCount = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.counts(), "profiles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count ?? 0;
    },
  });
};

/** 커뮤니티 게시글 전체 개수 */
export const useSuspenseCommunityPostCount = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.counts(), "communityPosts"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count ?? 0;
    },
  });
};

/** 신고 전체 개수 (pending 또는 reviewed) */
export const useSuspenseReportCount = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.counts(), "reports"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "reviewed"]);

      if (error) throw error;
      return count ?? 0;
    },
  });
};

// ========== 이번주 개수 ==========

/** 암장 이번주 개수 */
export const useSuspenseGymCountThisWeek = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.countsThisWeek(), "gyms"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("gyms")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", weekEnd.toISOString());

      if (error) throw error;
      return count ?? 0;
    },
  });
};

/** 프로필 이번주 개수 */
export const useSuspenseProfileCountThisWeek = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.countsThisWeek(), "profiles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", weekEnd.toISOString());

      if (error) throw error;
      return count ?? 0;
    },
  });
};

/** 커뮤니티 게시글 이번주 개수 */
export const useSuspenseCommunityPostCountThisWeek = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.countsThisWeek(), "communityPosts"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", weekEnd.toISOString());

      if (error) throw error;
      return count ?? 0;
    },
  });
};

// ========== 최근 활동 ==========

/** 최근 암장 활동 */
export const useSuspenseRecentGyms = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.recent(), "gyms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};

/** 최근 프로필 활동 */
export const useSuspenseRecentProfiles = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.recent(), "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};

/** 최근 커뮤니티 게시글 활동 */
export const useSuspenseRecentCommunityPosts = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.recent(), "communityPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};

/** 최근 신고 활동 */
export const useSuspenseRecentReports = () => {
  return useSuspenseQuery({
    queryKey: [...adminStatsKeys.recent(), "reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
