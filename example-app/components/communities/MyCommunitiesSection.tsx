import { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptyState } from "@/components/EmptyState";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunityCardSkeleton } from "@/components/skeletons/CommunityCardSkeleton";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";

export const MyCommunitiesSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.queries.getUserOwnedCommunities,
    {},
    { initialNumItems: 10 }
  );

  const loading = status === "LoadingFirstPage";

  const handleUpgrade = useCallback(() => {
    // router.push("/screens/subscription");
  }, []);


  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const handleCommunityPress = useCallback((community: any) => {
    router.push(`/screens/community/${community.communityId}`);
  }, []);

  const renderCommunity = useCallback(
    ({ item }: { item: any }) => (
      <CommunityCard community={item} onPress={handleCommunityPress} />
    ),
    [handleCommunityPress]
  );

  const renderSkeleton = useCallback(() => <CommunityCardSkeleton />, []);
  const skeletonData = useMemo(() => Array(10).fill(null), []);

  const renderEmptyState = useCallback(() => <EmptyState halfScreen />, []);

  const renderItem = loading ? renderSkeleton : renderCommunity;
  const keyExtractor = useCallback(
    (item: any, index: number) => (loading ? `skeleton-${index}` : item.communityId),
    [loading]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 400,
    },
    contentContainer: {
      paddingTop: 20,
    },
    restrictedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      paddingVertical: 40,
    },
    restrictedText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
      <FlashList
        data={loading ? skeletonData : results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};
