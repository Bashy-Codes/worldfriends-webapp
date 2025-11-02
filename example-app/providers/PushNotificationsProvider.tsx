import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { router } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    vibrate: [0, 250, 250, 250],
  }),
});

interface PushNotificationsContextType {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

const PushNotificationsContext = createContext<PushNotificationsContextType>({});

export const usePushNotificationsContext = () => useContext(PushNotificationsContext);

export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);


  const recordPushToken = useMutation(api.pushNotifications.recordPushToken);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        console.log("📱 Push Token:", token);
        setExpoPushToken(token);
        
        const storedToken = await AsyncStorage.getItem("@push_token");
        if (storedToken !== token) {
          try {
            await recordPushToken({ pushToken: token });
            await AsyncStorage.setItem("@push_token", token);
          } catch (error) {
            console.error("Failed to record push token:", error);
          }
        }
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      handleNotificationResponse(data);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <PushNotificationsContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </PushNotificationsContext.Provider>
  );
}

function handleRegistrationError(errorMessage: string) {
  console.error(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!");
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
      return;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

interface NotificationData {
  type?: string;
  postId?: string;
  [key: string]: any;
}

function handleNotificationResponse(data: NotificationData) {
  if (!data) return;

  if (data.type === "post_commented" || data.type === "post_reaction" || data.type === "comment_replied") {
    if (data.postId) {
      router.push(`/screens/post/${data.postId}`);
    }
  } else if (data.type === "discussion_thread_replied") {
    if (data.discussionId) {
      router.push(`/screens/discussion/${data.discussionId}`);
    }
  }
}