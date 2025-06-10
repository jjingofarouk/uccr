import { useInfiniteQuery } from '@tanstack/react-query';
import { getCases, getCaseById } from '../firebase/firestore';

export const useCases = (uid = null, pageSize = 10) => {
  const queryKey = ['cases', uid || 'all'];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = null }) => {
      const { cases, lastDoc } = await getCases(uid, pageSize, pageParam);
      return { cases, nextCursor: lastDoc };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep cache for 10 minutes
    retry: 1, // Retry failed requests once
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });

  // Flatten pages into a single array of cases
  const cases = data?.pages.flatMap((page) => page.cases) || [];

  return {
    cases,
    getCaseById,
    loading: isLoading || isFetchingNextPage,
    error: error?.message || null,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  };
};