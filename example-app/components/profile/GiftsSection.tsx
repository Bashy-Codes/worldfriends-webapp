import React, { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePaginatedQuery } from "convex/react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getProductById } from "@/constants/products";

// Components
import { EmptyState } from "@/components/EmptyState";
import { GiftCard } from "@/components/store/GiftCard";
import { GiftViewer } from "@/components/store/GiftViewer";

interface GiftsSectionProps {
  userId: Id<"users">;
  isFriend?: boolean;
}

export const GiftsSection: React.FC<GiftsSectionProps> = ({ userId, isFriend = true }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [showGiftViewer, setShowGiftViewer] = useState(false);

  const {
    results: gifts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.store.queries.getUserProfileGifts,
    isFriend ? { userId } : "skip",
    { initialNumItems: 10 }
  );

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const handleGiftPress = useCallback((gift: any) => {
    setSelectedGift(gift);
    setShowGiftViewer(true);
  }, []);

  const renderGiftItem = useCallback(({ item }: { item: any }) => {
    const productDetails = getProductById(item.productId);
    const giftData = {
      ...item,
      productDetails,
    };

    return (
      <GiftCard
        title={productDetails?.title || "Gift"}
        onPress={() => handleGiftPress(giftData)}
      />
    );
  }, [handleGiftPress]);

  const renderLoader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const renderFooter = useCallback(() => {
    if (status !== "LoadingMore") return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [status, theme.colors.primary]);

  const renderEmptyState = () => (
    <EmptyState fullScreen={true} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 300,
    },
    restrictedContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 40,
    },
    restrictedIcon: {
      marginBottom: 16,
    },
    restrictedMessage: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  if (!isFriend) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons
          name="lock-closed"
          size={48}
          color={theme.colors.textMuted}
          style={styles.restrictedIcon}
        />
        <Text style={styles.restrictedMessage}>{t("profile.restriction.gifts")}</Text>
      </View>
    );
  }

  if (status === "LoadingFirstPage") {
    return renderLoader();
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={gifts}
        keyExtractor={(item) => item.giftId}
        renderItem={renderGiftItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
      />

      <GiftViewer
        gift={selectedGift}
        visible={showGiftViewer}
        onRequestClose={() => setShowGiftViewer(false)}
      />
    </View>
  );
};