import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type UpdateSession = Database["public"]["Tables"]["sessions"]["Update"];

export const sessionKeys = {
  all: ["sessions"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...sessionKeys.all, "list", filters] as const)
      : ([...sessionKeys.all, "list"] as const),
  details: () => [...sessionKeys.all, "detail"] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};

// ========== 조회 ==========

/** 세션 전체 목록 조회 (Suspense 지원) - 사용자 및 암장 정보 포함 */
export const useSuspenseSessions = () => {
  return useSuspenseQuery({
    queryKey: sessionKeys.list(),
    queryFn: async () => {
      // 먼저 세션 조회
      const { data: sessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: false });

      if (sessionsError) throw sessionsError;
      if (!sessions) return [];

      // 각 세션의 사용자 및 암장 정보 조회
      const sessionsWithDetails = await Promise.all(
        sessions.map(async (session) => {
          const [profileResult, gymResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("id, nickname")
              .eq("id", session.user_id)
              .single(),
            supabase
              .from("gyms")
              .select("id, name")
              .eq("id", session.gym_id)
              .single(),
          ]);

          return {
            ...session,
            profiles: profileResult.data,
            gyms: gymResult.data,
          };
        })
      );

      return sessionsWithDetails;
    },
  });
};

/** 세션 단일 조회 (Suspense 지원) */
export const useSuspenseSession = (id: string) => {
  return useSuspenseQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: async () => {
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (sessionError) throw sessionError;
      if (!session) throw new Error("Session not found");

      // 사용자 및 암장 정보 조회
      const [profileResult, gymResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, nickname")
          .eq("id", session.user_id)
          .single(),
        supabase
          .from("gyms")
          .select("id, name")
          .eq("id", session.gym_id)
          .single(),
      ]);

      return {
        ...session,
        profiles: profileResult.data,
        gyms: gymResult.data,
      };
    },
  });
};

// ========== 수정 ==========

/** 세션 수정 Mutation */
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateSession;
    }) => {
      const { data, error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.list() });
    },
  });
};

/** 세션 삭제 Mutation */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sessions").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.list() });
    },
  });
};
