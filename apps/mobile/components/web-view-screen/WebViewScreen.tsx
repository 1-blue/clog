import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import {
  BackHandler,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { WEB_URL } from "../../constants";
import {
  ensurePushNotificationHandler,
  registerForPushNotificationsOnce,
} from "../../libs/pushNotifications";
import LoadingOverlay from "./LoadingOverlay";
import OfflineView from "./OfflineView";

// 💡 [iOS용] 스토어 대체를 위한 앱 ID 매핑
const IOS_APP_STORE_MAP: Record<string, string> = {
  /** 카카오톡 */
  kakaokompassauth: "362057947",
};

interface IProps {
  path?: string;
  authCallbackUrl?: string;
}

const isAndroid = Platform.OS === "android";

const WebViewScreen: React.FC<IProps> = ({ path = "", authCallbackUrl }) => {
  const { height: windowHeight } = useWindowDimensions();
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const lastHttpUrlRef = useRef(`${WEB_URL}${path}`);
  /** Android: ScrollView+RefreshControl 안에서 WebView 높이( flex만으로는 측정 안 될 때 대비 ) */
  const [webViewSlotHeight, setWebViewSlotHeight] = useState(0);
  /** Android: SwipeRefreshLayout(RefreshControl) 동작 중 */
  const [androidRefreshing, setAndroidRefreshing] = useState(false);

  const baseUri = `${WEB_URL}${path}`;
  // 인증 콜백 URL이 있으면 우선 사용, 재시도 시 기본 URL로 복원
  const [sourceUri, setSourceUri] = useState(authCallbackUrl || baseUri);

  // 💡 마지막으로 뒤로가기를 누른 시간을 저장할 변수
  const exitAppRef = useRef(0);

  // 스플래시 중복 호출 방지 (onLoadEnd는 페이지 이동마다 발생하므로 최초 1회만 hideAsync)
  const hasHiddenSplashRef = useRef(false);

  // 첫 로드 스피너 (내부 페이지 이동에서는 미표시)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // 오프라인/서버 오류 상태
  const [isOffline, setIsOffline] = useState(false);
  // 재시도 시 WebView 리마운트용 키
  const [webviewKey, setWebviewKey] = useState(0);

  /** Android Expo 푸시 — WebView 쿠키로 서버 등록 */
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [webLoadedOnce, setWebLoadedOnce] = useState(false);

  /** WebView 실제 origin과 네이티브 WEB_URL 불일치 시 쿠키가 안 붙어 401 나는 경우 방지 */
  const injectRegisterPushToken = useCallback((token: string) => {
    const wv = webViewRef.current;
    if (!wv) return;
    const script = `
(function(){
  var t = ${JSON.stringify(token)};
  var url = window.location.origin + '/api/v1/users/me/push-device';
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: t, platform: 'ANDROID' })
  })
    .then(function (r) { return r.text(); })
    .catch(function () {});
})();
true;
`;
    wv.injectJavaScript(script);
  }, []);

  /** 네비 핸들러·디바운스에서 최신 토큰/주입 함수 참조 */
  const expoPushTokenRef = useRef<string | null>(null);
  const injectRegisterPushTokenRef = useRef(injectRegisterPushToken);
  expoPushTokenRef.current = expoPushToken;
  injectRegisterPushTokenRef.current = injectRegisterPushToken;

  const pushRegisterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const webOriginPrefix = useMemo(
    () => WEB_URL.replace(/\/$/, ""),
    [],
  );

  useEffect(() => {
    if (!isAndroid) return;
    ensurePushNotificationHandler();
    void registerForPushNotificationsOnce().then((result) => {
      if (result.ok) setExpoPushToken(result.expoPushToken);
    });
  }, []);

  useEffect(() => {
    if (!isAndroid || !expoPushToken || !webLoadedOnce) return;
    injectRegisterPushToken(expoPushToken);
  }, [expoPushToken, webLoadedOnce, injectRegisterPushToken]);

  useEffect(() => {
    setWebLoadedOnce(false);
    setAndroidRefreshing(false);
  }, [webviewKey]);

  useEffect(() => {
    if (pushRegisterDebounceRef.current) {
      clearTimeout(pushRegisterDebounceRef.current);
      pushRegisterDebounceRef.current = null;
    }
  }, [webviewKey]);

  useEffect(
    () => () => {
      if (pushRegisterDebounceRef.current) {
        clearTimeout(pushRegisterDebounceRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isAndroid) return;

    const navigateFromPayload = (data: Record<string, unknown> | undefined) => {
      const link = typeof data?.link === "string" ? data.link : null;
      if (
        !link ||
        (!link.startsWith("http://") && !link.startsWith("https://"))
      ) {
        return;
      }
      webViewRef.current?.injectJavaScript(
        `window.location.href = ${JSON.stringify(link)}; true;`,
      );
    };

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as Record<string, unknown> | undefined;
        navigateFromPayload(data);
      },
    );

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content
        .data as Record<string, unknown> | undefined;
      navigateFromPayload(data);
    });

    return () => sub.remove();
  }, []);

  const hideSplash = () => {
    if (!hasHiddenSplashRef.current) {
      hasHiddenSplashRef.current = true;
      SplashScreen.hideAsync();
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    canGoBackRef.current = navState.canGoBack;
    if (
      navState.url.startsWith("http://") ||
      navState.url.startsWith("https://")
    ) {
      lastHttpUrlRef.current = navState.url;
    }

    // 로그인 등 클라이언트 라우팅 후에도 onLoadEnd가 다시 안 뜨는 경우가 있어,
    // 페이지 전환(로드 완료)마다 토큰 등록을 디바운스로 재시도한다.
    if (!isAndroid || navState.loading) return;
    const token = expoPushTokenRef.current;
    if (!token) return;
    if (!navState.url.startsWith(webOriginPrefix)) return;

    if (pushRegisterDebounceRef.current) {
      clearTimeout(pushRegisterDebounceRef.current);
    }
    pushRegisterDebounceRef.current = setTimeout(() => {
      pushRegisterDebounceRef.current = null;
      injectRegisterPushTokenRef.current(token);
    }, 700);
  };

  const onShouldStartLoadWithRequest = (event: any) => {
    const { url } = event;

    // ✅ Google OAuth는 WebView(User-Agent)에서 차단됨(403 disallowed_useragent)
    // Supabase authorize URL로 이동하려 할 때 redirect_to를 앱 딥링크로 바꿔서 "외부 브라우저"에서 진행한다.
    try {
      if (url.startsWith("https://")) {
        const u = new URL(url);
        const isSupabaseAuthorize = u.pathname.endsWith("/auth/v1/authorize");
        const provider = u.searchParams.get("provider");

        if (isSupabaseAuthorize && provider === "google") {
          const redirectTo = u.searchParams.get("redirect_to");
          let next = "/";
          if (redirectTo) {
            try {
              const r = new URL(redirectTo);
              next = r.searchParams.get("next") ?? "/";
            } catch {
              // ignore
            }
          }
          const nextSafe =
            next.startsWith("/") && !next.startsWith("//") ? next : "/";

          const deepLink = new URL("clog://auth/callback");
          deepLink.searchParams.set("next", nextSafe);
          u.searchParams.set("redirect_to", deepLink.toString());

          // 외부 브라우저로 OAuth 진행 (Google 정책 대응)
          Linking.openURL(u.toString());
          return false;
        }
      }
    } catch {
      // URL 파싱 실패 시 기존 로직 진행
    }

    // 1. 일반 웹페이지 (http, https)는 정상적으로 웹뷰에서 엽니다.
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("about:blank")
    ) {
      return true;
    }

    // 2. 안드로이드 (intent://) 3단계 폴백 처리
    if (Platform.OS === "android" && url.startsWith("intent")) {
      const schemeMatch = url.match(/scheme=([^;]+)/);
      const packageMatch = url.match(/package=([^;]+)/);
      const fallbackUrlMatch = url.match(/browser_fallback_url=([^;]+)/);

      const scheme = schemeMatch ? schemeMatch[1] : null;
      const packageName = packageMatch ? packageMatch[1] : null;
      const fallbackUrl = fallbackUrlMatch
        ? decodeURIComponent(fallbackUrlMatch[1])
        : null;

      if (scheme) {
        // intent:// 뒷부분의 쓸데없는 파라미터를 자르고 실제 앱 실행 주소만 추출
        const appUrl = url
          .replace("intent://", `${scheme}://`)
          .split("#Intent")[0];

        // [Step 1] 앱 실행 시도
        Linking.openURL(appUrl).catch(() => {
          // [Step 2] 앱이 없다면 웹에서 열기 (fallbackUrl)
          if (fallbackUrl) {
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(
                `window.location.href = '${fallbackUrl}';`,
              );
            }
          }
          // [Step 3] 대체 웹페이지도 없다면 플레이스토어로 이동
          else if (packageName) {
            Linking.openURL(`market://details?id=${packageName}`);
          }
        });
        return false;
      }
    }

    // 3. iOS 및 기타 커스텀 스킴 (카카오톡, 결제 앱 등) 처리
    // [Step 1] 앱 실행 시도
    Linking.openURL(url).catch(() => {
      // [Step 2 & 3] iOS는 intent 처럼 fallbackUrl이 주소에 없으므로 스토어로 직행
      if (Platform.OS === "ios") {
        const scheme = url.split("://")[0];
        const appId = IOS_APP_STORE_MAP[scheme];

        if (appId) {
          Linking.openURL(`https://apps.apple.com/kr/app/id${appId}`);
        } else {
          console.log("iOS 미등록 앱 스킴이거나 설치되지 않은 앱입니다:", url);
        }
      }
    });

    return false; // 처리를 가로챘으므로 웹뷰 자체 로딩은 중단합니다.
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // 1. 웹뷰 내부에 뒤로 갈 페이지가 있다면 웹뷰 뒤로가기 실행
        if (canGoBackRef.current && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }

        // 2. 더 이상 뒤로 갈 페이지가 없다면 (첫 화면이라면) 앱 종료 로직 실행
        const now = Date.now();
        // 2초(2000ms) 안에 뒤로가기를 두 번 눌렀다면 앱 강제 종료
        if (now - exitAppRef.current < 2000) {
          BackHandler.exitApp();
          return true;
        }

        // 처음 눌렀다면 시간 기록 후 안내 메시지 띄우기
        exitAppRef.current = now;
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "뒤로 가기 버튼을 한 번 더 누르면 종료됩니다.",
            ToastAndroid.SHORT,
          );
        }

        return true; // 기본 뒤로가기(앱 바로 꺼짐)를 막음
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const handleRetry = () => {
    setIsOffline(false);
    setIsInitialLoading(true);
    setSourceUri(baseUri); // 재시도 시 기본 URL로 복원
    hasHiddenSplashRef.current = true; // 재시도 시 스플래시는 다시 띄우지 않음
    setWebviewKey((k) => k + 1);
  };

  const onAndroidPullToRefresh = useCallback(() => {
    setAndroidRefreshing(true);
    webViewRef.current?.reload();
  }, []);

  const handleWebViewLoadEnd = useCallback(() => {
    setIsInitialLoading(false);
    setWebLoadedOnce(true);
    hideSplash();
    if (isAndroid) {
      setAndroidRefreshing(false);
    }
  }, [isAndroid]);

  const webViewAndroidHeight =
    webViewSlotHeight > 0 ? webViewSlotHeight : windowHeight;

  const webViewSharedProps = {
    source: { uri: sourceUri },
    onNavigationStateChange: handleNavigationStateChange,
    onShouldStartLoadWithRequest,
    originWhitelist: ["*"],
    javaScriptEnabled: true,
    domStorageEnabled: true,
    thirdPartyCookiesEnabled: true,
    onLoadEnd: handleWebViewLoadEnd,
    onError: () => {
      setIsOffline(true);
      hideSplash();
      if (isAndroid) setAndroidRefreshing(false);
    },
    onHttpError: (e: { nativeEvent: { statusCode: number } }) => {
      if (e.nativeEvent.statusCode >= 500) {
        setIsOffline(true);
        hideSplash();
        if (isAndroid) setAndroidRefreshing(false);
      }
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isOffline ? (
        <OfflineView onRetry={handleRetry} />
      ) : isAndroid ? (
        <View
          style={styles.flexFill}
          onLayout={(e) => {
            setWebViewSlotHeight(e.nativeEvent.layout.height);
          }}
        >
          <ScrollView
            style={styles.flexFill}
            contentContainerStyle={styles.androidScrollContent}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={androidRefreshing}
                onRefresh={onAndroidPullToRefresh}
                colors={["#E8E8E8"]}
                progressBackgroundColor="#2A2A2A"
              />
            }
          >
            <WebView
              key={webviewKey}
              ref={webViewRef}
              {...webViewSharedProps}
              nestedScrollEnabled
              style={[styles.webview, { height: webViewAndroidHeight }]}
            />
          </ScrollView>
        </View>
      ) : (
        <WebView
          key={webviewKey}
          ref={webViewRef}
          {...webViewSharedProps}
          style={styles.webview}
          pullToRefreshEnabled
          refreshControlLightMode
        />
      )}

      {/* 첫 로드 때만 표시하는 로딩 오버레이 */}
      {isInitialLoading && !isOffline && <LoadingOverlay />}
    </SafeAreaView>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151515" },
  flexFill: { flex: 1 },
  /** ScrollView 자식이 화면 높이만큼 차지하도록 — RefreshControl이 동작하려면 부모 스크롤 계층 필요 */
  androidScrollContent: {
    flexGrow: 1,
  },
  webview: { flex: 1, backgroundColor: "transparent" },
});
