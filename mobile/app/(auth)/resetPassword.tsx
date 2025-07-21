import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth.style";
import { getThemeColors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/AuthStore";

const schema = z
  .object({
    code: z.string().min(4, "Verification code is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: { code: string, password: string, confirmPassword: string }) => {
    // check if password and confirmPassword match
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    resetPassword(data.code, data.password);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        authStyles.container,
        { backgroundColor: COLORS.background },
      ]}
    >
      <Image
        source={require("../../assets/images/reset_password.png")}
        style={authStyles.image}
        contentFit="contain"
      />

      <Text style={[authStyles.title, { color: COLORS.text }]}>
        Reset Your Password
      </Text>

      {/* Code Input */}
      <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
        <Ionicons
          name="key-outline"
          size={20}
          style={[authStyles.icon, { color: COLORS.textLight }]}
        />
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[authStyles.input, { color: COLORS.text }]}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.textLight}
              value={value}
              onChangeText={onChange}
              keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
            />
          )}
        />
      </View>
      {errors.code && (
        <Text style={[authStyles.errorText, { color: COLORS.error }]}>
          {errors.code.message}
        </Text>
      )}

      {/* New Password */}
      <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={COLORS.textLight}
          style={authStyles.icon}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="New Password"
              secureTextEntry={!showPassword}
              placeholderTextColor={COLORS.textLight}
              style={[authStyles.input, { color: COLORS.text }]}
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

      {/* Confirm Password */}
      <View style={[authStyles.formGroup, { borderColor: COLORS.border }]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          style={[authStyles.icon, { color: COLORS.textLight }]}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[authStyles.input, { color: COLORS.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showConfirmPassword}
              value={value}
              onChangeText={onChange}
              keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
            />
          )}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={[authStyles.errorText, { color: COLORS.error }]}>
          {errors.confirmPassword.message}
        </Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[authStyles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={[authStyles.buttonText, { color: COLORS.white }]}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={[authStyles.link, { color: COLORS.primary }]}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default ResetPasswordScreen;
