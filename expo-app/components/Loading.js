import { View, ActivityIndicator, StyleSheet } from "react-native";

export const LoadingOverlay = ({
  visible,
  borderRadius = 0,
  marginTop = 50,
  scale = 2,
  color = "#0000ff",
  backgroundColor = "white",
  opacity = 0.5,
  width = "100%",
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.overlay,
        { borderRadius, marginTop, backgroundColor, opacity, width },
      ]}
    >
      <ActivityIndicator
        size="large"
        color={color}
        style={{ transform: [{ scale }] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    zIndex: 10,
  },
});
