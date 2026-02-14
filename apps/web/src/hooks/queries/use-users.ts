import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"];
type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];

export const userKeys = {
  all: ["users"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...userKeys.all, "list", filters] as const)
      : ([...userKeys.all, "list"] as const),
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};

// ========== 조회 ==========

/** 사용자 전체 목록 조회 */
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** 사용자 전체 목록 조회 (Suspense 지원) - 세션 수 포함 */
export const useSuspenseUsers = () => {
  return useSuspenseQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      // 프로필 조회
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      // 모든 세션을 한 번에 가져와서 그룹화
      const { data: allSessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("user_id");

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        // 세션 조회 실패 시 세션 수를 0으로 설정
        return profiles.map((profile) => ({
          ...profile,
          session_count: 0,
        }));
      }

      // user_id별로 세션 수 계산
      const sessionCountMap = new Map<string, number>();
      if (allSessions) {
        allSessions.forEach((session) => {
          const count = sessionCountMap.get(session.user_id) || 0;
          sessionCountMap.set(session.user_id, count + 1);
        });
      }

      // 프로필에 세션 수 추가
      return profiles.map((profile) => ({
        ...profile,
        session_count: sessionCountMap.get(profile.id) || 0,
      }));
    },
  });
};

/** 사용자 단일 조회 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

/** 사용자 단일 조회 (Suspense 지원) */
export const useSuspenseUser = (id: string) => {
  return useSuspenseQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

/** 사용자 통계 조회 (Suspense 지원) */
export const useSuspenseUserStats = () => {
  return useSuspenseQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      // 전체 사용자 수
      const { count: totalCount, error: totalError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (totalError) throw totalError;

      // 이번 주 신규 사용자 수 (월요일부터)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 월요일로 조정
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);

      const { count: thisWeekCount, error: weekError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString());

      if (weekError) throw weekError;

      // 활성 사용자 (세션이 있는 사용자)
      const { count: activeCount, error: activeError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("id", "is", null); // 일단 전체를 활성으로 간주

      if (activeError) throw activeError;

      return {
        total: totalCount ?? 0,
        thisWeek: thisWeekCount ?? 0,
        active: activeCount ?? 0,
        suspended: 0, // 정지 기능은 나중에 추가
      };
    },
  });
};

// ========== 수정 ==========

/** 사용자 수정 Mutation */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateProfile;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/** 사용자 삭제 Mutation */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};
