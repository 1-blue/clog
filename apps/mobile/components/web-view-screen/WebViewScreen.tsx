import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  Alert,
  BackHandler,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  WebView,
  type WebViewMessageEvent,
  type WebViewNavigation,
} from "react-native-webview";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { WEB_URL } from "../../constants";
import {
  ensurePushNotificationHandler,
  Notifications,
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

/** 구글: 네이티브 id_token → WebView에서 Auth.js callback으로 세션 쿠키. 카카오는 웹뷰 내 OAuth. */

const WebViewScreen: React.FC<IProps> = ({ path = "", authCallbackUrl }) => {
  const { height: windowHeight } = useWindowDimensions();
  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);
  const lastHttpUrlRef = useRef(`${WEB_URL}${path}`);
  /** Android: ScrollView+RefreshControl 안에서 WebView 높이( flex만으로는 측정 안 될 때 대비 ) */
  const [webViewSlotHeight, setWebViewSlotHeight] = useState(0);
  /** Android: SwipeRefreshLayout(RefreshControl) 동작 중 */
  const [androidRefreshing, setAndroidRefreshing] = useState(false);
  /** Android: WebView 내부 스크롤이 최상단인지 여부 — RefreshControl 활성화 조건 */
  const [isWebViewAtTop, setIsWebViewAtTop] = useState(true);

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

  const baseUri = `${WEB_URL}${path}`;
  const [sourceUri, setSourceUri] = useState(authCallbackUrl || `${WEB_URL}${path}`);

  /** WebView 실제 origin과 네이티브 WEB_URL 불일치 시 쿠키가 안 붙어 401 나는 경우 방지 */
  const injectRegisterPushToken = useCallback((token: string) => {
    const wv = webViewRef.current;
    if (!wv) return;
    const script = `
(function(){
  var t = ${JSON.stringify(token)};
  var origin = window.location.origin;
  var authBase = origin + '/api/auth';
  var meUrl = origin + '/api/v1/users/me';
  var pushUrl = origin + '/api/v1/users/me/push-device';
  function safeJson(text) {
    try { return JSON.parse(text); } catch (e) { return null; }
  }
  function hasPayloadUser(j) {
    return !!(j && typeof j === 'object' && j.payload && typeof j.payload === 'object' && j.payload.id);
  }
  function signOutAndGoLogin() {
    try {
      fetch(authBase + '/csrf', { credentials: 'include' })
        .then(function(r){ return r.text(); })
        .then(function(t){
          var j = safeJson(t);
          var csrfToken = j && j.csrfToken ? j.csrfToken : null;
          if (!csrfToken) return;
          return fetch(authBase + '/signout', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ csrfToken: csrfToken, callbackUrl: origin + '/login' }).toString()
          });
        })
        .then(function(){
          window.location.href = origin + '/login';
        })
        .catch(function(){
          window.location.href = origin + '/login';
        });
    } catch (e) {
      window.location.href = origin + '/login';
    }
  }
  fetch(meUrl, { credentials: 'include' })
    .then(function (r) {
      var ghost = false;
      try {
        ghost = r.headers && r.headers.get && (r.headers.get('x-clog-ghost-session') === '1');
      } catch (e) {}
      if (!r.ok) return { ok: false, status: r.status, text: '', ghost: ghost };
      return r.text().then(function (text) { return { ok: true, status: r.status, text: text, ghost: ghost }; });
    })
    .then(function (x) {
      if (x.ghost) {
        signOutAndGoLogin();
        return;
      }
      if (!x.ok) {
        // 고스트 세션: 세션은 있는데 DB 유저가 없을 때 /users/me 가 404
        if (x.status === 404) signOutAndGoLogin();
        return;
      }
      var j = safeJson(x.text);
      // 비로그인(200 payload:null) 또는 고스트 세션(404) 등은 푸시 등록 스킵
      if (!hasPayloadUser(j)) return;
      return fetch(pushUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, platform: 'ANDROID' })
      });
    })
    .then(function () {})
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

  const webOriginPrefix = useMemo(() => WEB_URL.replace(/\/$/, ""), []);

  const authApiBase = useMemo(
    () => `${WEB_URL.replace(/\/$/, "")}/api/auth`,
    [],
  );

  useEffect(() => {
    const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
    if (!webId) {
      return;
    }
    GoogleSignin.configure({
      webClientId: webId,
      offlineAccess: false,
    });
  }, []);

  const injectGoogleIdTokenSession = useCallback(
    (idToken: string, callbackPath: string) => {
      const wv = webViewRef.current;
      if (!wv) return;

      const nextUrl = (() => {
        try {
          if (callbackPath.startsWith("http://") || callbackPath.startsWith("https://")) {
            return callbackPath;
          }
          const u = new URL(callbackPath, `${WEB_URL}/`);
          return u.toString();
        } catch {
          return `${WEB_URL}${callbackPath.startsWith("/") ? "" : "/"}${callbackPath}`;
        }
      })();

      const script = `
(function(){
  var idToken = ${JSON.stringify(idToken)};
  var nextUrl = ${JSON.stringify(nextUrl)};
  var authBase = ${JSON.stringify(authApiBase)};
  function postErr(msg) {
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'clog.auth.error', message: msg }));
      }
    } catch (e) {}
  }
  fetch(authBase + '/csrf', { credentials: 'include' })
    .then(function(r){ return r.json(); })
    .then(function(csrf){
      if (!csrf || !csrf.csrfToken) {
        postErr('로그인에 실패했습니다. 다시 시도해 주세요.');
        return Promise.reject(new Error('csrf'));
      }
      return fetch(authBase + '/callback/google-id-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Auth-Return-Redirect': '1'
        },
        credentials: 'include',
        body: new URLSearchParams({
          idToken: idToken,
          csrfToken: csrf.csrfToken,
          callbackUrl: nextUrl
        }).toString()
      });
    })
    .then(function(r){
      return r.text().then(function(t){
        var j = {};
        try { j = JSON.parse(t); } catch (e) {}
        return { ok: r.ok, j: j, status: r.status };
      });
    })
    .then(function(x){
      if (x.ok) {
        window.location.href = nextUrl;
        return;
      }
      postErr('로그인에 실패했습니다. 다시 시도해 주세요.');
    })
    .catch(function(e){
      if (e && e.message !== 'csrf') postErr('로그인에 실패했습니다. 다시 시도해 주세요.');
    });
})();
true;
`;
      wv.injectJavaScript(script);
    },
    [authApiBase],
  );

  const runNativeGoogleSignIn = useCallback(
    async (nextPath: string) => {
      const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
      if (!webId) {
        return;
      }
      try {
        if (isAndroid) {
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });
        }
        const response = await GoogleSignin.signIn();
        if (response.type !== "success") return;
        let idToken = response.data.idToken;
        if (!idToken) {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        }
        if (!idToken) {
          Alert.alert("로그인", "로그인에 실패했습니다. 다시 시도해 주세요.");
          return;
        }
        injectGoogleIdTokenSession(idToken, nextPath);
      } catch (e) {
        Alert.alert("로그인", "로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    },
    [injectGoogleIdTokenSession],
  );

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          next?: string;
          message?: string;
        };
        if (data.type === "clog.auth.error") {
          Alert.alert("로그인", "로그인에 실패했습니다. 다시 시도해 주세요.");
          return;
        }
        if (data.type !== "clog.oauth.google") return;
        const next = data.next ?? "/";
        void runNativeGoogleSignIn(next);
      } catch {
        // ignore
      }
    },
    [runNativeGoogleSignIn],
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
    if (!isAndroid || !Notifications) return;

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
        const data = response.notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        navigateFromPayload(data);
      },
    );

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
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

  const handleWebViewScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      // 작은 값(예: 1px 미만)은 최상단으로 간주 — 부드러운 스크롤 종료 시 0이 정확히 안 들어올 수 있음
      setIsWebViewAtTop(e.nativeEvent.contentOffset.y <= 0);
    },
    [],
  );

  const handleWebViewLoadEnd = useCallback(() => {
    setIsInitialLoading(false);
    setWebLoadedOnce(true);
    hideSplash();
    if (isAndroid) {
      setAndroidRefreshing(false);
      setIsWebViewAtTop(true);
    }
  }, [isAndroid]);

  const webViewAndroidHeight =
    webViewSlotHeight > 0 ? webViewSlotHeight : windowHeight;

  const webViewSharedProps = {
    source: { uri: sourceUri },
    onNavigationStateChange: handleNavigationStateChange,
    onShouldStartLoadWithRequest,
    onMessage: handleWebViewMessage,
    originWhitelist: ["*"],
    javaScriptEnabled: true,
    domStorageEnabled: true,
    thirdPartyCookiesEnabled: true,
    sharedCookiesEnabled: true,
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
                enabled={isWebViewAtTop}
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
              onScroll={handleWebViewScroll}
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
  flexFill: { flex: 1, backgroundColor: "#151515" },
  /** ScrollView 자식이 화면 높이만큼 차지하도록 — RefreshControl이 동작하려면 부모 스크롤 계층 필요 */
  androidScrollContent: {
    flexGrow: 1,
  },
  webview: { flex: 1, backgroundColor: "#151515" },
});
