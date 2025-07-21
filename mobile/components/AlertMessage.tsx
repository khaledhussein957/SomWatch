import { getThemeColors } from "@/constants/Colors";
import React, { useEffect } from "react";
import { Text, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

const AlertMessage = ({
  error,
  clearError,
}: {
  error: string | null;
  clearError: () => void;
}) => {
  const translateY = useSharedValue(-50); // start from top
  const opacity = useSharedValue(0);

  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    if (error) {
      // Animate in
      translateY.value = withDelay(200, withTiming(0, { duration: 400 }));
      opacity.value = withDelay(200, withTiming(1, { duration: 400 }));

      // Hide after 5 seconds
      const timer = setTimeout(() => {
        translateY.value = withTiming(-50, { duration: 400 });
        opacity.value = withTiming(0, { duration: 400 }, () => {
          runOnJS(clearError)(); // Reset the error message
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, translateY, opacity, clearError]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!error) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        },
      ]}
    >
      <Text style={{ color: COLORS.error }}>{error}</Text>
    </Animated.View>
  );
};

export default AlertMessage;
