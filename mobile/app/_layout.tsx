import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function RootLayout() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState(false);

  // ✅ Live network monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkError(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Navigation control
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (networkError) {
        router.replace("/networkError");
      } else {
        router.replace("/(tabs)");
      }
    };

    checkAuthAndRedirect();
  }, [networkError, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="networkError" />
      <StatusBar style="auto" />
    </Stack>
  );
}
