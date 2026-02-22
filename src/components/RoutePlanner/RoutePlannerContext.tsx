import { createContext, useContext, useMemo, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import { useDirection, useOptimizedDirection } from '../../api/geo/hooks'
import type { Direction } from '../../api/geo/locationIq/types'
import type { RouteOption } from '../../types'
import { newRoute } from '../../types'

type RoutePlannerContextValue = {
  routeOptions: Array<RouteOption>
  setRouteOptions: React.Dispatch<React.SetStateAction<Array<RouteOption>>>
  activeRouteId: UUIDTypes
  setActiveRouteId: React.Dispatch<React.SetStateAction<UUIDTypes>>
  activeRoute: RouteOption | undefined

  direction: Direction | undefined
  isDirectionFetching: boolean
  directionError: unknown

  calculateRoute: () => Promise<void>
  calculateOptimizedRoute: () => Promise<void>
}

const RoutePlannerContext = createContext<RoutePlannerContextValue | null>(null)

export function RoutePlannerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [routeOptions, setRouteOptions] = useState<Array<RouteOption>>([
    newRoute,
  ])
  const [activeRouteId, setActiveRouteId] = useState<UUIDTypes>(newRoute.id)

  const activeRoute = activeRouteId
    ? routeOptions.find((route) => route.id === activeRouteId)
    : undefined

  const directionQuery = useDirection(activeRoute)
  const optimizedQuery = useOptimizedDirection(activeRoute)

  const value = useMemo<RoutePlannerContextValue>(() => {
    const calculateRoute = async () => {
      const route = activeRoute
      if (!route?.startingLocation || !route.destination) return
      await directionQuery.refetch()
    }

    const calculateOptimizedRoute = async () => {
      await optimizedQuery.refetch()
    }

    return {
      routeOptions,
      setRouteOptions,
      activeRouteId,
      setActiveRouteId,
      activeRoute,

      direction: directionQuery.data,
      isDirectionFetching: directionQuery.isFetching,
      directionError: directionQuery.error,
      calculateRoute,

      calculateOptimizedRoute,
    }
  }, [
    activeRoute,
    activeRouteId,
    directionQuery.data,
    directionQuery.error,
    directionQuery.isFetching,
    directionQuery.refetch,
    routeOptions,
  ])

  return (
    <RoutePlannerContext.Provider value={value}>
      {children}
    </RoutePlannerContext.Provider>
  )
}

export function useRoutePlanner() {
  const ctx = useContext(RoutePlannerContext)
  if (!ctx)
    throw new Error('useRoutePlanner must be used within RoutePlannerProvider')
  return ctx
}
