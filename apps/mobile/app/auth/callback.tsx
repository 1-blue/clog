import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { WEB_URL } from "../../constants";

// 외부 브라우저에서 OAuth 완료 후 clog://auth/callback 딥링크로 돌아왔을 때 처리
const AuthCallback = () => {
  const { code, next } = useLocalSearchParams<{
    code?: string;
    next?: string;
  }>();

  useEffect(() => {
    const nextSafe =
      next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

    if (code) {
      const callbackUrl = new URL(`${WEB_URL}/auth/callback`);
      callbackUrl.searchParams.set("code", code);
      callbackUrl.searchParams.set("next", nextSafe);

      router.replace({
        pathname: "/",
        params: { authCallbackUrl: callbackUrl.toString() },
      });
    } else {
      router.replace("/");
    }
  }, [code, next]);

  // 라우트 전환 중 깜빡임 방지
  return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
};

export default AuthCallback;
