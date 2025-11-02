import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const convex = new ConvexReactClient('https://backend.worldfriends.app', {
  unsavedChangesWarning: false,
});

export const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export const storageConfig = Platform.OS === "android" || Platform.OS === "ios"
  ? secureStorage
  : undefined
