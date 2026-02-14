# Skill: query-hook — TanStack Query 훅 생성

## 목적
Supabase 테이블에 대한 TanStack Query 훅 파일을 생성한다.
관리자/공개/인증 어디서든 동일한 훅을 사용한다.

## 출력 위치
`apps/web/src/hooks/queries/use-{resource-kebab}.ts`

## 기본 구조

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { supabase } from "@clog/db/web";
import type { Database } from "@clog/db";

// ========== 타입 ==========
type New{Resource} = Database["public"]["Tables"]["{table}"]["Insert"];
type Update{Resource} = Database["public"]["Tables"]["{table}"]["Update"];

// ========== Query Keys ==========
export const {resource}Keys = {
  all: ["{table}"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...{resource}Keys.all, "list", filters] as const)
      : ([...{resource}Keys.all, "list"] as const),
  details: () => [...{resource}Keys.all, "detail"] as const,
  detail: (id: string) => [...{resource}Keys.details(), id] as const,
  stats: () => [...{resource}Keys.all, "stats"] as const,
};

// ========== 조회 ==========

export const use{Resource}s = () => {
  return useQuery({
    queryKey: {resource}Keys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("{table}")
        .select("*")
        .order("{orderBy}", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useSuspense{Resource}s = () => {
  return useSuspenseQuery({
    queryKey: {resource}Keys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("{table}")
        .select("*")
        .order("{orderBy}", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const use{Resource} = (id: string) => {
  return useQuery({
    queryKey: {resource}Keys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("{table}")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useSuspense{Resource} = (id: string) => {
  return useSuspenseQuery({
    queryKey: {resource}Keys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("{table}")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
};

// ========== 생성 ==========

export const useCreate{Resource} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: New{Resource}) => {
      const { data, error } = await supabase
        .from("{table}")
        .insert(newItem)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {resource}Keys.list() });
    },
  });
};

// ========== 수정 ==========

export const useUpdate{Resource} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Update{Resource} }) => {
      const { data, error } = await supabase
        .from("{table}")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: {resource}Keys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: {resource}Keys.list() });
    },
  });
};

// ========== 삭제 ==========

export const useDelete{Resource} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("{table}").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {resource}Keys.list() });
    },
  });
};
```

## 옵션: 관계 조인

다른 테이블 데이터를 함께 가져올 때:

```tsx
export const useSuspense{Resource}s = () => {
  return useSuspenseQuery({
    queryKey: {resource}Keys.list(),
    queryFn: async () => {
      const { data: items, error } = await supabase
        .from("{table}")
        .select("*")
        .order("{orderBy}", { ascending: false });
      if (error) throw error;
      if (!items) return [];

      const withDetails = await Promise.all(
        items.map(async (item) => {
          const [relResult] = await Promise.all([
            supabase.from("{relatedTable}").select("id, name").eq("id", item.{fk}).single(),
          ]);
          return { ...item, {relatedTable}: relResult.data };
        })
      );
      return withDetails;
    },
  });
};
```

## 옵션: 통계

```tsx
export const useSuspense{Resource}Stats = () => {
  return useSuspenseQuery({
    queryKey: {resource}Keys.stats(),
    queryFn: async () => {
      const { count: totalCount, error: totalError } = await supabase
        .from("{table}")
        .select("*", { count: "exact", head: true });
      if (totalError) throw totalError;

      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);

      const { count: thisWeekCount, error: weekError } = await supabase
        .from("{table}")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString());
      if (weekError) throw weekError;

      return { total: totalCount ?? 0, thisWeek: thisWeekCount ?? 0 };
    },
  });
};
```

## 규칙
- 파일명: `use-{kebab-case}.ts`
- keys의 all 값은 테이블명과 일치
- 필요한 CRUD만 포함 (조회만 필요하면 mutation 제외)
- mutation의 onSuccess에서 관련 쿼리 invalidate
