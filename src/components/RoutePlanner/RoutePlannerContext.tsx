import { createContext, useContext, useMemo, useState } from 'react'
import { useDirection, useOptimizedDirection } from '../../api/geo/hooks'
import type { Direction } from '../../api/geo/locationIq/types'
import type { RouteOption } from '../../types'
import { newRoute } from '../../types'

type RoutePlannerContextValue = {
  routeOptions: Array<RouteOption>
  setRouteOptions: React.Dispatch<React.SetStateAction<Array<RouteOption>>>

  setActiveRoute: React.Dispatch<React.SetStateAction<RouteOption>>
  activeRoute: RouteOption

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
  const [routeOptions, setRouteOptions] = useState<Array<RouteOption>>([])

  const [activeRoute, setActiveRoute] = useState<RouteOption>(newRoute)

  const directionQuery = useDirection(activeRoute)
  const optimizedQuery = useOptimizedDirection(activeRoute)

  const value = useMemo<RoutePlannerContextValue>(() => {
    const calculateRoute = async () => {
      const { data } = await directionQuery.refetch()
      if (data) {
        setRouteOptions((prev) => [
          ...prev,
          { ...activeRoute, direction: data },
        ])
      }
    }

    const calculateOptimizedRoute = async () => {
      await optimizedQuery.refetch()
    }

    return {
      routeOptions,
      setRouteOptions,

      setActiveRoute,
      activeRoute,

      direction: directionQuery.data,
      isDirectionFetching: directionQuery.isFetching,
      directionError: directionQuery.error,
      calculateRoute,

      calculateOptimizedRoute,
    }
  }, [
    activeRoute,
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
