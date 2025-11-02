import { useState, useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getProductById } from "@/constants/products";

export type InventorySection = "received" | "owned" | "sent";

export const useInventory = () => {
  const [activeSection, setActiveSection] = useState<InventorySection>("owned");

  const sendGiftMutation = useMutation(api.store.mutations.sendGift);

  // Get user's owned products
  const {
    results: userProducts,
    status: productsStatus,
    loadMore: loadMoreProducts,
  } = usePaginatedQuery(
    api.store.queries.getUserProducts,
    activeSection === "owned" ? {} : "skip",
    { initialNumItems: 10 }
  );

  // Get received gifts
  const {
    results: receivedGifts,
    status: receivedStatus,
    loadMore: loadMoreReceived,
  } = usePaginatedQuery(
    api.store.queries.getUserReceivedGifts,
    activeSection === "received" ? {} : "skip",
    { initialNumItems: 10 }
  );

  // Get sent gifts
  const {
    results: sentGifts,
    status: sentStatus,
    loadMore: loadMoreSent,
  } = usePaginatedQuery(
    api.store.queries.getUserSentGifts,
    activeSection === "sent" ? {} : "skip",
    { initialNumItems: 10 }
  );

  const handleSectionChange = useCallback((section: InventorySection) => {
    setActiveSection(section);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (activeSection === "owned" && productsStatus === "CanLoadMore") {
      loadMoreProducts(10);
    } else if (activeSection === "received" && receivedStatus === "CanLoadMore") {
      loadMoreReceived(10);
    } else if (activeSection === "sent" && sentStatus === "CanLoadMore") {
      loadMoreSent(10);
    }
  }, [activeSection, productsStatus, receivedStatus, sentStatus, loadMoreProducts, loadMoreReceived, loadMoreSent]);

  const sendGift = useCallback(async (receiverId: Id<"users">, productId: string) => {
    try {
      await sendGiftMutation({ receiverId, productId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to send gift" };
    }
  }, [sendGiftMutation]);

  const getCurrentData = useCallback(() => {
    switch (activeSection) {
      case "owned":
        return userProducts?.map(product => ({
          ...product,
          productDetails: getProductById(product.productId)
        })) || [];
      case "received":
        return receivedGifts?.map(gift => ({
          ...gift,
          productDetails: getProductById(gift.productId)
        })) || [];
      case "sent":
        return sentGifts?.map(gift => ({
          ...gift,
          productDetails: getProductById(gift.productId)
        })) || [];
      default:
        return [];
    }
  }, [activeSection, userProducts, receivedGifts, sentGifts]);

  const getCurrentStatus = useCallback(() => {
    switch (activeSection) {
      case "owned":
        return productsStatus;
      case "received":
        return receivedStatus;
      case "sent":
        return sentStatus;
      default:
        return "LoadingFirstPage";
    }
  }, [activeSection, productsStatus, receivedStatus, sentStatus]);

  return {
    activeSection,
    handleSectionChange,
    getCurrentData,
    getCurrentStatus,
    handleLoadMore,
    sendGift,
  };
};