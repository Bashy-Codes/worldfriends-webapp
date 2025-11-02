import { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { usePaginatedQuery, useMutation } from "convex/react";
import { router } from "expo-router";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { EmptyState } from "@/components/EmptyState";
import { LetterCard } from "@/components/letters/LetterCard";
import { LetterCardSkeleton } from "@/components/skeletons/LetterCardSkeleton";

export const ReceivedLettersSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    results: letters,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.letters.queries.getUserReceivedLetters,
    {},
    { initialNumItems: 10 }
  );

  const deleteLetterMutation = useMutation(api.letters.mutations.deleteLetter);

  const loading = status === "LoadingFirstPage";
  const loadingMore = status === "LoadingMore";

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const handleDeleteLetter = useCallback(async (letterId: Id<"letters">) => {
    try {
      await deleteLetterMutation({ letterId });
      Toast.show({
        type: "success",
        text1: t("successToasts.letterDeleted")
      });
    } catch (error) {
      console.error("Failed to delete letter:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    }
  }, [deleteLetterMutation, t]);

  const handleOpenLetter = useCallback((letterId: Id<"letters">) => {
    router.push(`/screens/letter/${letterId}`);
  }, []);

  const renderLetter = useCallback(
    ({ item }: { item: any }) => (
      <LetterCard
        letter={item}
        onDelete={handleDeleteLetter}
        onOpen={handleOpenLetter}
      />
    ),
    [handleDeleteLetter, handleOpenLetter]
  );

  const renderSkeleton = useCallback(() => <LetterCardSkeleton />, []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [loadingMore, theme.colors.primary]);

  const renderEmptyState = useCallback(() => {
    return <EmptyState halfScreen />;
  }, []);

  const skeletonData = useMemo(() => Array(10).fill(null), []);
  const isInitialLoading = loading && (letters || []).length === 0;
  const renderItem = isInitialLoading ? renderSkeleton : renderLetter;
  const keyExtractor = useCallback(
    (item: any, index: number) => (isInitialLoading ? `skeleton-${index}` : item.letterId),
    [isInitialLoading]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 400,
    },
    contentContainer: {
      paddingTop: 20,
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <FlashList
        data={isInitialLoading ? skeletonData : letters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isInitialLoading ? renderEmptyState : null}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};