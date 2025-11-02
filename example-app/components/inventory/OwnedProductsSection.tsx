import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/lib/Theme";
import { getProductById } from "@/constants/products";

import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/store/ProductCard";

interface OwnedProductsSectionProps {
  onProductPress: (product: any) => void;
}

export const OwnedProductsSection = ({ onProductPress }: OwnedProductsSectionProps) => {
  const theme = useTheme();

  const {
    results: userProducts,
    status: productsStatus,
    loadMore: loadMoreProducts,
  } = usePaginatedQuery(
    api.store.queries.getUserProducts,
    {},
    { initialNumItems: 10 }
  );

  const handleLoadMore = useCallback(() => {
    if (productsStatus === "CanLoadMore") {
      loadMoreProducts(10);
    }
  }, [productsStatus, loadMoreProducts]);

  const data = userProducts?.map(product => ({
    ...product,
    productDetails: getProductById(product.productId)
  })).filter(item => item.productDetails) || [];

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item.productDetails}
      onPress={() => onProductPress(item)}
      quantity={item.quantity}
    />
  ), [onProductPress]);

  const isLoading = productsStatus === "LoadingFirstPage";

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
        keyExtractor={(item, index) => `owned-${index}`}
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