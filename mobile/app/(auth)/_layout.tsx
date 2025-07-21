import { Stack } from "expo-router"


const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="resetPassword" />
    </Stack>
  )
}

export default AuthLayout