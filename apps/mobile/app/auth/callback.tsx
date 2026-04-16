import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useEffect } from "react";

import { WEB_URL } from "../../constants";

/** clog://auth/callback — 딥링크 복귀 시 WebView 시작 URL만 지정 (핸드오프 제거) */
const AuthCallback = () => {
  const { next } = useLocalSearchParams<{
    next?: string;
  }>();

  useEffect(() => {
    const nextSafe =
      next && typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/";

    router.replace({
      pathname: "/",
      params: { authCallbackUrl: `${WEB_URL}${nextSafe}` },
    });
  }, [next]);

  return <View style={{ flex: 1, backgroundColor: "#151515" }} />;
};

export default AuthCallback;
