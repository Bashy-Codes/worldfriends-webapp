import "react-native-gesture-handler";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true });

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Stack } from "expo-router";
import { convex, storageConfig } from "@/lib/convex";
import { AppThemeProvider } from "@/providers/ThemeProvider";
import { PushNotificationsProvider } from "@/providers/PushNotificationsProvider";
import { useTheme } from "@/lib/Theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/providers/ToastConfig";
import "@/lib/i18n";

function AppContent() {
  const theme = useTheme();

  return (
    <ConvexAuthProvider client={convex} storage={storageConfig}>
      <PushNotificationsProvider>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="screens" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </PushNotificationsProvider>
    </ConvexAuthProvider >
  );
}

function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;