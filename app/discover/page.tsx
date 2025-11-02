'use client';

import { useState, useMemo } from 'react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Filter, Search, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import UserCard from '@/components/discovery/UserCard';
import DiscoveryFilterModal from '@/components/discovery/DiscoveryFilterModal';
import { DiscoveryFilters } from '@/types/discovery';

export default function DiscoverPage() {
  const [filters, setFilters] = useState<DiscoveryFilters>({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  const queryArgs = useMemo(() => {
    const hasActiveFilters = filters.country || filters.spokenLanguage || filters.learningLanguage;
    if (hasActiveFilters) {
      return {
        country: filters.country || undefined,
        spokenLanguage: filters.spokenLanguage || undefined,
        learningLanguage: filters.learningLanguage || undefined,
      };
    }
    return {};
  }, [filters]);

  const {
    results: users,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.discover.getUsersForDiscovery,
    queryArgs,
    { initialNumItems: 10 }
  );

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 py-6 px-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Discover People</h1>
                  <p className="text-gray-400">Find new friends from around the world</p>
                </div>
                
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors relative"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.country && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>Country: {filters.country}</span>
                      <button
                        onClick={() => setFilters({...filters, country: undefined})}
                        className="hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.spokenLanguage && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>Speaks: {filters.spokenLanguage}</span>
                      <button
                        onClick={() => setFilters({...filters, spokenLanguage: undefined})}
                        className="hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.learningLanguage && (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <span>Learning: {filters.learningLanguage}</span>
                      <button
                        onClick={() => setFilters({...filters, learningLanguage: undefined})}
                        className="hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Users Grid */}
            {status === "LoadingFirstPage" ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white">Loading users...</div>
              </div>
            ) : users && users.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>

                {/* Load More */}
                {status === "CanLoadMore" && (
                  <div className="text-center py-6">
                    <button
                      onClick={handleLoadMore}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}

                {status === "LoadingMore" && (
                  <div className="text-center py-6">
                    <div className="text-gray-400">Loading more users...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-gray-400 mb-4">
                  {activeFilterCount > 0 
                    ? "Try adjusting your filters to find more people"
                    : "Check back later for new people to discover"
                  }
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters({})}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
        
        <RightSidebar />
      </div>

      <DiscoveryFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
}