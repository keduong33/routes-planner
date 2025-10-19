import { useQuery } from '@tanstack/react-query'
import { createGeoApi } from './geoApi'

const provider = 'locationiq'
const geoAPI = createGeoApi(provider)

export function useSearchAddress(query: string) {
  return useQuery({
    queryKey: ['search', provider, query],
    queryFn: () => geoAPI.search(query),
    // false to fetch manually
    enabled: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
