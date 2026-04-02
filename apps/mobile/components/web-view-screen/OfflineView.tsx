import { Pressable, StyleSheet, Text, View } from "react-native";

interface IProps {
  onRetry: () => void;
}

const OfflineView: React.FC<IProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧗</Text>
      <Text style={styles.title}>연결이 끊겼어요</Text>
      <Text style={styles.desc}>
        {"인터넷 연결을 확인하고\n다시 시도해 주세요."}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>다시 시도</Text>
      </Pressable>
    </View>
  );
};

export default OfflineView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    color: "#E8E0D8",
    fontSize: 20,
    fontWeight: "bold",
  },
  desc: {
    color: "#6B6B6B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
