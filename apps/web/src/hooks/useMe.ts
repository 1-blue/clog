import { openapi } from "#web/apis/openapi";

/** GET /users/me — 비로그인도 200이므로 `me`는 null일 수 있음 (401 없음) */
const useMe = () => {
  const { data: me } = openapi.useQuery("get", "/api/v1/users/me", undefined, {
    retry: false,
    staleTime: 100_000,
  });

  return { me: me?.payload };
};

export default useMe;
