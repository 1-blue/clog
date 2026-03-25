/**
 * RSC/SSR에서 `fetch()`는 브라우저와 달리 요청 쿠키를 자동으로 붙이지 않아
 * 같은 오리진의 Route Handler(`/api/...`) 호출 시 세션이 비어 401이 납니다.
 * 클라이언트에서는 기본 `fetch`를 그대로 씁니다.
 */
export const ssrAwareFetch: typeof fetch = async (input, init) => {
  if (typeof window !== "undefined") {
    return globalThis.fetch(input, init);
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const headers = new Headers(init?.headers ?? {});
    if (input instanceof Request) {
      input.headers.forEach((value, key) => {
        if (key.toLowerCase() === "cookie") return;
        if (!headers.has(key)) headers.set(key, value);
      });
    }
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    return globalThis.fetch(input, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    return globalThis.fetch(input, init);
  }
};
