import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-20">
      <Text className="text-2xl font-bold">This is a modal</Text>
      <Link href="/" dismissTo className="mt-15 py-15">
        <Text className="text-blue-500">Go to home screen</Text>
      </Link>
    </View>
  );
}
