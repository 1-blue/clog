import { cache } from "react";

import { fetchClient } from "#web/apis/openapi";

/** 메타데이터·notFound·프리패치 전 존재 확인용 (요청 단위 캐시) */
export const getRecordPayloadCached = cache(async (recordId: string) => {
  const { data, error, response } = await fetchClient.GET(
    "/api/v1/records/{recordId}",
    { params: { path: { recordId } } },
  );
  if (error || response.status !== 200 || !data?.payload) return null;
  return data.payload;
});
