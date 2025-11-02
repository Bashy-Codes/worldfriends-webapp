import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/lib/Theme";
import { getProductById } from "@/constants/products";

import { EmptyState } from "@/components/EmptyState";
import { GiftCard } from "@/components/store/GiftCard";

interface ReceivedGiftsSectionProps {
  onGiftPress: (gift: any) => void;
}

export const ReceivedGiftsSection = ({ onGiftPress }: ReceivedGiftsSectionProps) => {
  const theme = useTheme();

  const {
    results: receivedGifts,
    status: receivedStatus,
    loadMore: loadMoreReceived,
  } = usePaginatedQuery(
    api.store.queries.getUserReceivedGifts,
    {},
    { initialNumItems: 10 }
  );

  const handleLoadMore = useCallback(() => {
    if (receivedStatus === "CanLoadMore") {
      loadMoreReceived(10);
    }
  }, [receivedStatus, loadMoreReceived]);

  const data = receivedGifts?.map(gift => ({
    ...gift,
    productDetails: getProductById(gift.productId)
  })) || [];

  const renderItem = useCallback(({ item }: { item: any }) => (
    <GiftCard
      title={item.productDetails?.title || "Unknown Gift"}
      onPress={() => onGiftPress({ ...item })}
    />
  ), [onGiftPress]);

  const isLoading = receivedStatus === "LoadingFirstPage";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 400,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 400,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        keyExtractor={(item, index) => `received-${index}`}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <EmptyState fullScreen />}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
      />
    </View>
  );
};