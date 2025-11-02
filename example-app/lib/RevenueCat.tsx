import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, CustomerInfo } from "react-native-purchases";

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || "";
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || "";

export const initializeRevenueCat = async (userId?: string) => {
  if (Platform.OS === "ios") {
    await Purchases.configure({ 
      apiKey: REVENUECAT_API_KEY_IOS,
      appUserID: userId,
    });
  } else if (Platform.OS === "android") {
    await Purchases.configure({ 
      apiKey: "goog_HveuqiqhyWQwsXRkbMPptyXxhry",
      appUserID: userId,
    });
  }
  
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }
};

export const purchaseProduct = async (productId: string): Promise<CustomerInfo> => {
  const products = await Purchases.getProducts([productId]);
  if (products.length === 0) {
    throw new Error("Product not found");
  }
  
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
  return customerInfo;
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
  return await Purchases.restorePurchases();
};

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  return await Purchases.getCustomerInfo();
};
