import { View, Text, Button, useColorScheme } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { getThemeColors } from "@/constants/Colors";

import SafeScreen from "../../components/SafeScreen";

import { favoritesStyles } from "@/assets/styles/favorites.style";

const FavoritesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      if (!token || !userStr) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <Text style={{ color: COLORS.text }}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View
        style={[
          favoritesStyles.container,
          {
            backgroundColor: COLORS.background,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={[favoritesStyles.name, { color: COLORS.text }]}>
            Guest
          </Text>
          <Text style={[favoritesStyles.email, { color: COLORS.textLight }]}>
            Welcome to somWatch
          </Text>
        </View>
        <Button
          title="Join Now"
          onPress={() => router.replace("/login")}
          color={COLORS.primary}
        />
      </View>
    );
  }
  return (
    <SafeScreen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.text }}>Your Favorites</Text>
        {/* Render user's favorite items here */}
      </View>
    </SafeScreen>
  );
};

export default FavoritesScreen;
