import { Stack } from "expo-router";
import { LogBox } from "react-native";

// Expo Go에서 발생하는 SplashModule 에러 무시
// development build 또는 프로덕션에서는 발생하지 않음
LogBox.ignoreLogs(["SplashModule.internalPreventAutoHideAsync"]);
LogBox.ignoreLogs(["SplashModule.internalMaybeHideAsync"]);

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
