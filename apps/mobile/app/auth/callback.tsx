import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useEffect } from "react";

import { WEB_URL } from "../../constants";

// 외부 브라우저 OAuth 후 앱으로 복귀 — 웹 세션은 브라우저 쿠키에만 있을 수 있어 WebView를 홈으로 다시 연다.
const AuthCallback = () => {
  const { next } = useLocalSearchParams<{
    next?: string;
  }>();

  useEffect(() => {
    const nextSafe =
      next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

    router.replace({
      pathname: "/",
      params: { authCallbackUrl: `${WEB_URL}${nextSafe}` },
    });
  }, [next]);

  // 라우트 전환 중 깜빡임 방지
  return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
};

export default AuthCallback;
