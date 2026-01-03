import { getBaseUrl } from "#/src/utils/getBaseUrl";
import { Text } from "react-native";
import WebView from "react-native-webview";

export default function TabTwoScreen() {
  return (
    <>
      <Text className="text-2xl font-bold text-blue-500">
        Hello World Explore
      </Text>

      <WebView
        source={{ uri: `${getBaseUrl()}/design-system` }}
        style={{ marginTop: 20 }}
      />
    </>
  );
}
