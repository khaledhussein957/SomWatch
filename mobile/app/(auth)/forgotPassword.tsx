import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "../../assets/styles/auth.style";
import { getThemeColors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/AuthStore";

const schema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required"),
});

function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const COLORS = getThemeColors(colorScheme === "dark" ? "dark" : "light");
  const router = useRouter();

  const { forgotPassword, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const onSubmit = (data: { emailOrPhone: string }) => {
    forgotPassword(data.emailOrPhone);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        authStyles.container,
        { backgroundColor: COLORS.background },
      ]}
    >
      <Image
        source={require("../../assets/images/forgot_password.png")}
        style={authStyles.image}
        contentFit="contain"
      />

      <Text style={[authStyles.title, { color: COLORS.text }]}>
        Forgot Password
      </Text>

      {/** Email or Phone Input */}
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
              placeholder="Enter your Email or Phone"
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

      {/** Reset Button */}
      <TouchableOpacity
        style={[authStyles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={[authStyles.buttonText, { color: COLORS.white }]}>
          {isLoading ? "Sending..." : "Send Reset Code"}
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

export default ForgotPasswordScreen;
