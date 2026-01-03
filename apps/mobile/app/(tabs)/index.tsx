import { useEffect, useState } from "react";
import { Text } from "react-native";
import { WebView } from "react-native-webview";
import { Database } from "@clog/db";
import { supabase } from "@clog/db/mobile";
import { getBaseUrl } from "#/src/utils/getBaseUrl";

export default function HomeScreen() {
  const [gyms, setGyms] = useState<
    Database["public"]["Tables"]["gyms"]["Row"][]
  >([]);

  useEffect(() => {
    const getGyms = async () => {
      const { data, error } = await supabase.from("gyms").select("*");
      if (error) {
        console.error(error);
      }
      setGyms(data ?? []);
    };
    getGyms();
  }, []);

  return (
    <>
      <Text className="text-2xl font-bold text-blue-500">
        Hello World Index {gyms.map((gym) => gym.name).join(", ")}
      </Text>

      <WebView
        source={{ uri: `${getBaseUrl()}/db` }}
        style={{ marginTop: 20 }}
      />
    </>
  );
}
