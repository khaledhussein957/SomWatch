import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth.style";
import { getThemeColors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
  fetchDiscoveryAsync,
} from "expo-auth-session";
import { useAuthStore } from "../../store/AuthStore";
import AlertMessage from "@/components/AlertMessage";

WebBrowser.maybeCompleteAuthSession();

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username is required").toLowerCase().trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().min(9, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function RegisterScreen() {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { callBack, isLoading, error, setError, signup } = useAuthStore();

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
      clientId: "<GOOGLE_CLIENT_ID>",
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
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    await signup(
      data.name,
      data.username,
      data.email,
      data.password,
      data.phone
    );
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
          source={require("../../assets/images/register.png")}
          style={authStyles.image}
          contentFit="contain"
        />

        <Text style={[authStyles.title, { color: COLORS.text }]}>
          Create Account
        </Text>

        {/** Full Name */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="person-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Full Name"
                placeholderTextColor={COLORS.textLight}
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
              />
            )}
          />
        </View>
        {errors.name && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.name.message}
          </Text>
        )}

        {/** Username */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="person-circle-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Username"
                placeholderTextColor={COLORS.textLight}
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
              />
            )}
          />
        </View>
        {errors.username && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.username.message}
          </Text>
        )}

        {/** Email */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="mail-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
              />
            )}
          />
        </View>
        {errors.email && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.email.message}
          </Text>
        )}

        {/** Phone */}
        <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
          <Ionicons
            name="call-outline"
            size={20}
            style={[authStyles.icon, { color: COLORS.textLight }]}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[authStyles.input, { color: COLORS.text }]}
                placeholder="Phone"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
              />
            )}
          />
        </View>
        {errors.phone && (
          <Text style={[authStyles.errorText, { color: COLORS.error }]}>
            {errors.phone.message}
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

        {/** Register Button */}
        <TouchableOpacity
          style={[authStyles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[authStyles.buttonText, { color: COLORS.white }]}>
            Register
          </Text>
        </TouchableOpacity>

        <Text style={[authStyles.orText, { color: COLORS.textLight }]}>or</Text>

        <TouchableOpacity
          style={authStyles.googleButton}
          onPress={handleGoogleLogin}
          disabled={!request || isLoading}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={authStyles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[authStyles.link, { color: COLORS.primary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
