import { useLocalSearchParams } from "expo-router";

import WebViewScreen from "../components/web-view-screen/WebViewScreen";

const Page = () => {
  const { authCallbackUrl } = useLocalSearchParams<{
    authCallbackUrl?: string;
  }>();

  return <WebViewScreen authCallbackUrl={authCallbackUrl} />;
};

export default Page;
