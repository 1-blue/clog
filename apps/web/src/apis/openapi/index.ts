import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "#web/@types/openapi";

// TODO: 환경변수 NEXT_PUBLIC_API_URL (프로덕션 배포 시 실제 API URL로 변경)
const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
});

export const openapi = createClient(fetchClient);
export { fetchClient };
