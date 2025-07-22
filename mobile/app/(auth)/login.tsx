import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth.style";
import { getThemeColors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchDiscoveryAsync,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import { useAuthStore } from "@/store/AuthStore";
import AlertMessage from "@/components/AlertMessage";

const schema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required").trim(),
  password: z.string().min(8, "Password must be at least 6 characters"),
});

function LoginScreen() {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { callBack, isLoading, error, setError, login } = useAuthStore();

  const [discovery, setDiscovery] = useState<
    import("expo-auth-session").DiscoveryDocument | null
  >(null);

  useEffect(() => {
    (async () => {
      const config = await fetchDiscoveryAsync("https://accounts.google.com");
      setDiscovery(config);
    })();
  }, []);

  const redirectUri = makeRedirectUri({
    scheme: "somwatch",
    path: "login-success",
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Constants.expoConfig?.extra?.googleClientId ?? "",
      responseType: ResponseType.Code,
      scopes: ["openid", "profile", "email"],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      callBack(code);
    } else if (response?.type === "error") {
      console.error("Auth error", response.error);
    }
  }, [response, callBack]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (data: { emailOrPhone: string; password: string }) => {
    await login(data.emailOrPhone, data.password);
    if (useAuthStore.getState().isAuthenticated) {
      router.replace("/(tabs)");
    }
  };

  const handleGoogleLogin = () => {
    if (request) {
      promptAsync();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={authStyles.keyboardView}
    >
      <View style={{ position: "absolute", top: 32, left: 24, zIndex: 10 }}>
        <TouchableOpacity
          style={[authStyles.closeButton, { backgroundColor: COLORS.primary }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[
          authStyles.container,
          { backgroundColor: COLORS.background },
        ]}
      >
        <AlertMessage error={error} clearError={() => setError(null)} />
        <Image
          source={require("../../assets/images/login.png")}
          style={authStyles.image}
          contentFit="contain"
        />

        <Text style={[authStyles.title, { color: COLORS.text }]}>Login</Text>

        {/** Email or Phone */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="mail-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="emailOrPhone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Email or Phone"
                placeholderTextColor={COLORS.textLight}
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
        </View>
        {errors.emailOrPhone && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.emailOrPhone.message}
          </Text>
        )}

        {/** Password */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
              />
            )}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.password.message}
          </Text>
        )}

        {/* Forgot password link */}
        <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
          <Text
            style={[
              authStyles.link,
              { color: COLORS.primary, textAlign: "right", marginBottom: 12 },
            ]}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/** Login Button */}
        <TouchableOpacity
          style={[authStyles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[authStyles.buttonText, { color: COLORS.white }]}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <Text style={[authStyles.orText, { color: COLORS.textLight }]}>or</Text>

        {/** Google Button */}
        <TouchableOpacity
          style={authStyles.googleButton}
          onPress={handleGoogleLogin}
          disabled={!request || isLoading}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={authStyles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={[authStyles.link, { color: COLORS.primary }]}>
            Don&apos;t have an account? Register
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
