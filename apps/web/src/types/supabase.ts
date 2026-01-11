export interface SupabaseQueryResponse<T> {
  data: T | null;
  error: { message: string } | null;
  count?: number | null;
  status: number;
  statusText: string;
}
