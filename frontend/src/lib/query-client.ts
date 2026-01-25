/**
 * TanStack Query Client Configuration
 *
 * Configures React Query with optimized caching strategy:
 * - staleTime: 5 minutes (prevents redundant fetches)
 * - cacheTime: 10 minutes (keeps data in cache for fast navigation)
 * - refetchOnWindowFocus: true (ensures fresh data when user returns)
 * - retry: 3 (retry failed requests up to 3 times)
 */

import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Refetch when window regains focus
      refetchOnWindowFocus: true,

      // Retry failed requests
      retry: 3,

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
})

/**
 * Clear all queries (useful on sign out)
 */
export function clearQueries() {
  queryClient.clear()
}

/**
 * Invalidate specific query keys
 * @param queryKey - Array of query keys to invalidate
 */
export function invalidateQueries(queryKey: string[]) {
  queryClient.invalidateQueries({ queryKey })
}
