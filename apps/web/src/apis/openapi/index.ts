import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "#web/@types/openapi";
import { ssrAwareFetch } from "#web/apis/openapi/ssr-fetch";

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  fetch: ssrAwareFetch,
});

export const openapi = createClient(fetchClient);
export { fetchClient };
