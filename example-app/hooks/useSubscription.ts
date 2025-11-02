import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Purchases, { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import Toast from "react-native-toast-message";

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const updatePremiumStatus = useMutation(api.users.mutations.updatePremiumStatus);
  const currentUser = useQuery(api.users.queries.getCurrentUser);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
    }
  };

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const monthlyPackage = offerings.current?.availablePackages.find(
        pkg => pkg.identifier === "$rc_monthly"
      );

      if (!monthlyPackage) {
        throw new Error("Monthly subscription not found");
      }

      const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);

      if (customerInfo.entitlements.active["premium"]) {
        await updatePremiumStatus({ isPremium: true });
        Toast.show({
          type: "success",
          text1: "Welcome to Premium!",
          text2: "Your subscription is now active",
        });
        return { success: true };
      } else {
        throw new Error("Subscription verification failed");
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Toast.show({
          type: "error",
          text1: "Subscription Failed",
          text2: error.message || "Something went wrong",
        });
      }
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [updatePremiumStatus]);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active["premium"] !== undefined;
      
      if (currentUser?.isPremium !== isPremium) {
        await updatePremiumStatus({ isPremium });
      }
      
      return isPremium;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }, [currentUser, updatePremiumStatus]);

  return {
    subscribe,
    checkSubscriptionStatus,
    isLoading,
    isPremium: currentUser?.isPremium || false,
    packages,
  };
};
