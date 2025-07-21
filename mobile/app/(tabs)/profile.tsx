import React, { useEffect, useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeScreen from "../../components/SafeScreen";
import GuestProfile from "../../components/GuestProfile";
import UserProfile from "../../components/UserProfile";
import { getThemeColors } from "../../constants/Colors";

import { User } from "../../store/AuthStore";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState("Free");
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("system");
  const [themeLoaded, setThemeLoaded] = useState(false);
  const COLORS = getThemeColors(
    theme === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : theme
  );

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      const savedTheme = await AsyncStorage.getItem("theme");

      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      setThemeLoaded(true);

      if (!token || !userStr) {
        setIsAuthenticated(false);
      } else {
        setUser(JSON.parse(userStr));
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  if (loading || !themeLoaded) {
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

  const resolvedTheme =
    theme === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : theme;

  return (
    <SafeScreen>
      {isAuthenticated && user ? (
        <UserProfile
          user={user}
          theme={resolvedTheme}
          rawTheme={theme}
          handleThemeChange={handleThemeChange}
          handleLogout={handleLogout}
          subscription={subscription}
        />
      ) : (
        <GuestProfile
          theme={resolvedTheme}
          rawTheme={theme}
          handleThemeChange={handleThemeChange}
        />
      )}
    </SafeScreen>
  );
};

export default ProfileScreen;
