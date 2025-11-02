import { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptyState } from "@/components/EmptyState";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunityCardSkeleton } from "@/components/skeletons/CommunityCardSkeleton";

export const JoinedCommunitiesSection = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.queries.getJoinedCommunities,
    {},
    { initialNumItems: 10 }
  );

  const loading = status === "LoadingFirstPage";

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
