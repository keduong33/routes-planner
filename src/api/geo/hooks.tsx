import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import type { RouteOption } from '../../types'
import { createGeoApi } from './geoApi'

const provider = 'locationiq'
const geoAPI = createGeoApi(provider)

const baseUseQuery = {
  // false to fetch manually
  enabled: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  retry: false,
}

export function useSearchAddress(query: string) {
  return useQuery({
    queryKey: ['search', provider, query],
    queryFn: () => geoAPI.search(query),
    ...baseUseQuery,
  })
}

export function useAutocomplete(
  query: string,
  debounceSecond: number = 1,
  biasLat?: number,
  biasLon?: number,
) {
  const debouncedQuery = useDebounce(query, debounceSecond * 1000)

  return useQuery({
    ...baseUseQuery,
    queryKey: ['autocomplete', provider, debouncedQuery, biasLat, biasLon],
    queryFn: () => geoAPI.autocomplete(debouncedQuery, biasLat, biasLon),
    enabled: debouncedQuery.length > 0,
  })
}

export function useDirection(route?: RouteOption) {
  return useQuery({
    queryKey: ['direction', provider, route],
    queryFn: () => {
      if (!route) throw new Error('No route for direction')
      return geoAPI.getDirections(route)
    },
    ...baseUseQuery,
  })
}

export function useOptimizedDirection(route?: RouteOption) {
  return useQuery({
    queryKey: ['optimizedDirection', provider, route],
    queryFn: () => {
      if (!route) throw new Error('No route for optimized direction')
      return geoAPI.getOptimizedRoute(route)
    },
    ...baseUseQuery,
  })
}
