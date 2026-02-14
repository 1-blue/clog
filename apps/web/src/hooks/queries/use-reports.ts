import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// 타입 정의
type UpdateReport = Database["public"]["Tables"]["reports"]["Update"];

export const reportKeys = {
  all: ["reports"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...reportKeys.all, "list", filters] as const)
      : ([...reportKeys.all, "list"] as const),
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

// ========== 조회 ==========

/** 신고 전체 목록 조회 (Suspense 지원) */
export const useSuspenseReports = () => {
  return useSuspenseQuery({
    queryKey: reportKeys.list(),
    queryFn: async () => {
      const { data: reports, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;
      if (!reports) return [];

      // 신고자 정보 가져오기
      const reporterIds = [
        ...new Set(reports.map((r) => r.reporter_id).filter(Boolean)),
      ];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", reporterIds);

      if (profilesError) throw profilesError;

      // 프로필 맵 생성
      const profileMap = new Map(
        (profiles || []).map((p) => [p.id, p.nickname || null])
      );

      // 신고 데이터에 신고자 이름 추가
      return reports.map((report) => ({
        ...report,
        reporter_nickname: profileMap.get(report.reporter_id) || null,
      }));
    },
  });
};

/** 신고 단일 조회 (Suspense 지원) */
export const useSuspenseReport = (id: string) => {
  return useSuspenseQuery({
    queryKey: reportKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// ========== 수정 ==========

/** 신고 수정 Mutation (기각/해결 처리) */
export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateReport;
    }) => {
      const { data, error } = await supabase
        .from("reports")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: reportKeys.list() });
    },
  });
};

/** 신고 삭제 Mutation */
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reports").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.list() });
    },
  });
};
