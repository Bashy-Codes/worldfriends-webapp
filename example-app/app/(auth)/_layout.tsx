import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="guidelines" options={{ headerShown: false }} />
      <Stack.Screen name="authentication" options={{ headerShown: false }} />
      <Stack.Screen name="otp-verification" options={{ headerShown: false }} />
    </Stack>
  );
}
