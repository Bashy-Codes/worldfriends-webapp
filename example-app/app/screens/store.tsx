import React, { useState, useCallback, useMemo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// hooks and types
import { useTheme } from "@/lib/Theme";
import { useStore } from "@/hooks/store/useStore";
import { Product } from "@/types/store";
import { useTranslation } from "react-i18next";
import { PRODUCTS } from "@/constants/products";
import { useRevenueCat } from "@/hooks/useRevenueCat";

// UI Components
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/common/Separator";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductViewer } from "@/components/store/ProductViewer";
import { StoreSearch } from "@/components/store/StoreSearch";
import { ScreenHeader } from "@/components/ScreenHeader";
import { EmptyState } from "@/components/EmptyState";
import { FlashList } from "@shopify/flash-list";

export default function StoreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  // States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { products } = useStore();
  const PRODUCTS_PER_PAGE = 10;
  const { purchaseProduct, isPurchasing } = useRevenueCat();

  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
    setViewerVisible(true);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerVisible(false);
    setSelectedProduct(null);
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedProduct) return;

    setPurchasing(true);
    try {
      const result = await purchaseProduct(selectedProduct.id);
      if (result.success) {
        setViewerVisible(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setPurchasing(false);
    }
  }, [selectedProduct, purchaseProduct]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Load initial products
  useEffect(() => {
    const initialProducts = PRODUCTS.slice(0, PRODUCTS_PER_PAGE);
    setLoadedProducts(initialProducts);
    setCurrentPage(1);
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || searchQuery.trim()) return;

    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const newProducts = PRODUCTS.slice(startIndex, endIndex);

    if (newProducts.length > 0) {
      setIsLoadingMore(true);
      // Simulate loading delay
      setTimeout(() => {
        setLoadedProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [currentPage, isLoadingMore, searchQuery]);

  const filteredProducts = useMemo(() => {
    const productsToFilter = searchQuery.trim() ? PRODUCTS : loadedProducts;

    if (!searchQuery.trim()) {
      return productsToFilter;
    }

    const query = searchQuery.toLowerCase();
    return productsToFilter.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [loadedProducts, searchQuery]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  ), [handleProductPress]);

  const renderHeader = useCallback(() => (
    <>
      <StoreSearch onSearch={handleSearch} />
      <Separator />
    </>
  ), [handleSearch]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    list: {
      paddingTop: 16,
    },
  });

  return (
    <>
      <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
        <ScreenHeader title={t("screenTitles.store")} />
        <View style={styles.content}>
          <FlashList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState fullScreen />}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
          />
        </View>
      </SafeAreaView>

      <ProductViewer
        product={selectedProduct}
        visible={viewerVisible}
        onRequestClose={handleCloseViewer}
        onPress={handlePurchase}
        loading={purchasing}
      />
    </>
  );
}