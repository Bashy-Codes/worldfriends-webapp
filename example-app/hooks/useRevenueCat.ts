import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { purchaseProduct as purchaseFromRevenueCat } from "@/lib/RevenueCat";
import Toast from "react-native-toast-message";

export const useRevenueCat = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const purchaseProductMutation = useMutation(api.store.mutations.purchaseProduct);

  const purchaseProduct = useCallback(async (productId: string) => {
    setIsPurchasing(true);
    try {
      const customerInfo = await purchaseFromRevenueCat(productId);
      
      if (customerInfo.nonSubscriptionTransactions.some(t => t.productIdentifier === productId)) {
        await purchaseProductMutation({ productId });
        Toast.show({
          type: "success",
          text1: "Purchase Successful",
          text2: "Product added to your inventory",
        });
        return { success: true };
      } else {
        throw new Error("Purchase verification failed");
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Toast.show({
          type: "error",
          text1: "Purchase Failed",
          text2: error.message || "Something went wrong",
        });
      }
      return { success: false, error };
    } finally {
      setIsPurchasing(false);
    }
  }, [purchaseProductMutation]);

  return {
    purchaseProduct,
    isPurchasing,
  };
};
