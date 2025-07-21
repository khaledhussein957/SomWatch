import { View, Text, StyleSheet, Image, useColorScheme } from "react-native";
import React from "react";
import { getThemeColors } from "../constants/Colors";

const NetworkErrorScreen = () => {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}> 
      <Image
        source={require("../assets/images/network_error.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: COLORS.error }]}>Network Error</Text>
      <Text style={[styles.message, { color: COLORS.text }]}>Unable to connect. Please check your internet connection and try again.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default NetworkErrorScreen;
