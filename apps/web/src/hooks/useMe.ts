import { openapi } from "#web/apis/openapi";

const useMe = () => {
  const { data: me } = openapi.useQuery("get", "/api/v1/users/me", undefined, {
    retry: false,
    staleTime: 100_000,
  });

  return { me: me?.payload };
};

export default useMe;
