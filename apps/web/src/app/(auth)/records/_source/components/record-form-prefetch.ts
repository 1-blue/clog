import type { QueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";

/** 기록 폼(추가·수정)에서 쓰는 암장 목록 프리패치 */
export async function prefetchGymsForRecordForm(qc: QueryClient) {
  await qc.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/gyms", {
      params: { query: { limit: 50 } },
    }),
  );
}

/** 수정 폼용 기록 상세 프리패치 */
export async function prefetchRecordById(qc: QueryClient, recordId: string) {
  await qc.prefetchQuery(
    openapi.queryOptions("get", "/api/v1/records/{recordId}", {
      params: { path: { recordId } },
    }),
  );
}
