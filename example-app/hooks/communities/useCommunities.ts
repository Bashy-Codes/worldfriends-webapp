import { useState, useCallback } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Community, CommunitiesSection } from "@/types/communities";

interface UseCommunitiesReturn {
  activeSection: CommunitiesSection;
  joinedCommunities: Community[];
  discoverCommunities: Community[];
  loading: boolean;
  handleSectionChange: (section: CommunitiesSection) => void;
  getCurrentData: () => Community[];
  handleLoadMore: () => void;
}

export const useCommunities = (): UseCommunitiesReturn => {
  const [activeSection, setActiveSection] = useState<CommunitiesSection>("joined");

  const joinedQuery = usePaginatedQuery(
    api.communities.queries.getJoinedCommunities,
    {},
    { initialNumItems: 10 }
  );

  const discoverQuery = usePaginatedQuery(
    api.communities.queries.getDiscoverCommunities,
    {},
    { initialNumItems: 10 }
  );

  const currentQuery = activeSection === "joined" ? joinedQuery : discoverQuery;
  const joinedCommunities = joinedQuery.results || [];
  const discoverCommunities = discoverQuery.results || [];
  const loading = currentQuery.status === "LoadingFirstPage";

  const handleSectionChange = useCallback((section: CommunitiesSection) => {
    setActiveSection(section);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (currentQuery.status === "CanLoadMore") {
      currentQuery.loadMore(10);
    }
  }, [currentQuery]);

  const getCurrentData = useCallback(() => {
    return activeSection === "joined" ? joinedCommunities : discoverCommunities;
  }, [activeSection, joinedCommunities, discoverCommunities]);

  return {
    activeSection,
    joinedCommunities,
    discoverCommunities,
    loading,
    handleSectionChange,
    getCurrentData,
    handleLoadMore,
  };
};