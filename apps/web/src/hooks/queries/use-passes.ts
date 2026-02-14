import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type UpdatePass = Database["public"]["Tables"]["passes"]["Update"];

export const passKeys = {
  all: ["passes"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...passKeys.all, "list", filters] as const)
      : ([...passKeys.all, "list"] as const),
  details: () => [...passKeys.all, "detail"] as const,
  detail: (id: string) => [...passKeys.details(), id] as const,
};

// ========== 조회 ==========

/** 회원권 전체 목록 조회 (Suspense 지원) - 사용자 및 암장 정보 포함 */
export const useSuspensePasses = () => {
  return useSuspenseQuery({
    queryKey: passKeys.list(),
    queryFn: async () => {
      // 먼저 회원권 조회
      const { data: passes, error: passesError } = await supabase
        .from("passes")
        .select("*")
        .order("created_at", { ascending: false });

      if (passesError) throw passesError;
      if (!passes) return [];

      // 각 회원권의 사용자 및 암장 정보 조회
      const passesWithDetails = await Promise.all(
        passes.map(async (pass) => {
          const [profileResult, gymResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("id, nickname")
              .eq("id", pass.user_id)
              .single(),
            supabase
              .from("gyms")
              .select("id, name")
              .eq("id", pass.gym_id)
              .single(),
          ]);

          return {
            ...pass,
            profiles: profileResult.data,
            gyms: gymResult.data,
          };
        })
      );

      return passesWithDetails;
    },
  });
};

/** 회원권 단일 조회 (Suspense 지원) */
export const useSuspensePass = (id: string) => {
  return useSuspenseQuery({
    queryKey: passKeys.detail(id),
    queryFn: async () => {
      const { data: pass, error: passError } = await supabase
        .from("passes")
        .select("*")
        .eq("id", id)
        .single();

      if (passError) throw passError;
      if (!pass) throw new Error("Pass not found");

      // 사용자 및 암장 정보 조회
      const [profileResult, gymResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, nickname")
          .eq("id", pass.user_id)
          .single(),
        supabase
          .from("gyms")
          .select("id, name")
          .eq("id", pass.gym_id)
          .single(),
      ]);

      return {
        ...pass,
        profiles: profileResult.data,
        gyms: gymResult.data,
      };
    },
  });
};

// ========== 수정 ==========

/** 회원권 수정 Mutation */
export const useUpdatePass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdatePass;
    }) => {
      const { data, error } = await supabase
        .from("passes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: passKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: passKeys.list() });
    },
  });
};

/** 회원권 삭제 Mutation */
export const useDeletePass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("passes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passKeys.list() });
    },
  });
};
