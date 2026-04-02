import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#E8E0D8" />
      <Text style={styles.text}>클로그</Text>
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  text: {
    color: "#6B6B6B",
    fontSize: 13,
    letterSpacing: 4,
    fontWeight: "500",
  },
});
