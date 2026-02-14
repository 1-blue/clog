import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type NewGym = Database["public"]["Tables"]["gyms"]["Insert"];
type UpdateGym = Database["public"]["Tables"]["gyms"]["Update"];

export const gymKeys = {
  all: ["gyms"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...gymKeys.all, "list", filters] as const)
      : ([...gymKeys.all, "list"] as const),
  details: () => [...gymKeys.all, "detail"] as const,
  detail: (id: string) => [...gymKeys.details(), id] as const,
};

// ========== 조회 ==========

/** 암장 전체 목록 조회 */
export const useGyms = () => {
  return useQuery({
    queryKey: gymKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** 암장 전체 목록 조회 (Suspense 지원) */
export const useSuspenseGyms = () => {
  return useSuspenseQuery({
    queryKey: gymKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** 암장 단일 조회 */
export const useGym = (id: string) => {
  return useQuery({
    queryKey: gymKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

/** 암장 단일 조회 (Suspense 지원) */
export const useSuspenseGym = (id: string) => {
  return useSuspenseQuery({
    queryKey: gymKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// ========== 생성 ==========

/** 암장 생성 Mutation */
export const useCreateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGym: NewGym) => {
      const { data, error } = await supabase
        .from("gyms")
        .insert(newGym)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.list() });
    },
  });
};

// ========== 수정 ==========

/**
 * 암장 수정 Mutation
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateGym }) => {
      const { data, error } = await supabase
        .from("gyms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: gymKeys.list() });
    },
  });
};

/** 암장 삭제 Mutation */
export const useDeleteGym = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gyms").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Suspense query를 invalidate하고 refetch합니다
      queryClient.invalidateQueries({ 
        queryKey: gymKeys.list(),
      });
      // Suspense query는 invalidate만으로도 자동 refetch됩니다
    },
  });
};
