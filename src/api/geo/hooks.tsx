import { useQuery } from '@tanstack/react-query'
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

export function useDirection(route?: RouteOption) {
  return useQuery({
    queryKey: ['direction', provider, route],
    queryFn: () => {
      if (!route) throw new Error('No route for direction')
      geoAPI.getDirections(route)
    },
    ...baseUseQuery,
  })
}
