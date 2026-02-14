import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type NewCommunityPost = Database["public"]["Tables"]["community_posts"]["Insert"];
type UpdateCommunityPost =
  Database["public"]["Tables"]["community_posts"]["Update"];

export const communityPostKeys = {
  all: ["communityPosts"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...communityPostKeys.all, "list", filters] as const)
      : ([...communityPostKeys.all, "list"] as const),
  details: () => [...communityPostKeys.all, "detail"] as const,
  detail: (id: string) => [...communityPostKeys.details(), id] as const,
  stats: () => [...communityPostKeys.all, "stats"] as const,
};

// ========== 조회 ==========

/** 커뮤니티 게시글 전체 목록 조회 (Suspense 지원) */
export const useSuspenseCommunityPosts = () => {
  return useSuspenseQuery({
    queryKey: communityPostKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** 커뮤니티 게시글 통계 조회 (Suspense 지원) */
export const useSuspenseCommunityPostStats = () => {
  return useSuspenseQuery({
    queryKey: communityPostKeys.stats(),
    queryFn: async () => {
      // 전체 게시글 수
      const { count: totalCount, error: totalError } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });

      if (totalError) throw totalError;

      // 오늘 작성된 게시글 수
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: todayCount, error: todayError } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      if (todayError) throw todayError;

      // 신고된 게시글 수
      const { count: reportedCount, error: reportedError } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .eq("is_reported", true);

      if (reportedError) throw reportedError;

      // 삭제된 게시글 수 (일단 0으로, 나중에 soft delete 추가 시 수정)
      const deletedCount = 0;

      return {
        total: totalCount ?? 0,
        today: todayCount ?? 0,
        reported: reportedCount ?? 0,
        deleted: deletedCount,
      };
    },
  });
};

/** 커뮤니티 게시글 단일 조회 (Suspense 지원) */
export const useSuspenseCommunityPost = (id: string) => {
  return useSuspenseQuery({
    queryKey: communityPostKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// ========== 수정 ==========

/** 커뮤니티 게시글 수정 Mutation */
export const useUpdateCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateCommunityPost;
    }) => {
      const { data, error } = await supabase
        .from("community_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: communityPostKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: communityPostKeys.list() });
      queryClient.invalidateQueries({ queryKey: communityPostKeys.stats() });
    },
  });
};

/** 커뮤니티 게시글 삭제 Mutation */
export const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityPostKeys.list() });
      queryClient.invalidateQueries({ queryKey: communityPostKeys.stats() });
    },
  });
};
