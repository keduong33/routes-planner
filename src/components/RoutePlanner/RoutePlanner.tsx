import { MapPinPlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import type { NormalizedLocation } from '../../api/geo/types'
import type { RouteOption } from '../../types'
import { newRoute } from '../../types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { SearchBar } from '../MapDrawer/SearchBar/SearchBar'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type RouteProps = {}

export function RoutePlanner() {
  const [routeOptions, setRouteOptions] = useState<Array<RouteOption>>([
    newRoute,
  ])
  const [activeRouteId, setActiveRouteId] = useState<UUIDTypes>(
    routeOptions[0].id,
  )
  const activeRoute = activeRouteId
    ? routeOptions.find((route) => route.id === activeRouteId)
    : undefined

  const handleLocationSelect = useCallback(
    (
      routeOptionId: UUIDTypes,
      fieldType: FieldType,
      location: NormalizedLocation,
      stopIndex?: number,
    ) => {
      setRouteOptions((routes) =>
        routes.map((route) => {
          if (route.id !== routeOptionId) return route

          if (fieldType === 'starting') {
            return {
              ...route,
              startingLocation: location,
            } satisfies RouteOption
          } else if (fieldType === 'destination') {
            return { ...route, destination: location } satisfies RouteOption
          } else if (stopIndex !== undefined) {
            const newStops = [...route.stops]
            newStops[stopIndex] = location
            return { ...route, stops: newStops } satisfies RouteOption
          } else return route
        }),
      )
    },
    [],
  )

  const addStop = useCallback(() => {
    if (!activeRouteId) return
    setRouteOptions((routes) =>
      routes.map((route) => {
        if (route.id !== activeRouteId) return route
        return { ...route, stops: [...route.stops, null] }
      }),
    )
  }, [activeRouteId])

  const removeStop = useCallback(
    (stopIndex: number) => {
      if (!activeRouteId) return
      setRouteOptions((routes) =>
        routes.map((route) => {
          if (route.id !== activeRouteId) return route
          return {
            ...route,
            stops: route.stops.filter((_, i) => i !== stopIndex),
          }
        }),
      )
    },
    [activeRouteId],
  )

  if (!activeRouteId || !activeRoute) {
    console.log('no active route id')
    return null
  }

  return (
    <div className="flex flex-col gap-y-3 h-full">
      <SearchBar
        initialLocation={activeRoute.startingLocation}
        activeRouteId={activeRouteId}
        handleLocationSelect={handleLocationSelect}
        fieldType="starting"
      />
      {activeRoute.stops.map((stop, i) => (
        <div key={`stop-${i}`} className="flex flex-row gap-x-2 items-center">
          <SearchBar
            initialLocation={stop}
            activeRouteId={activeRouteId}
            handleLocationSelect={handleLocationSelect}
            fieldType="stop"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" onClick={() => removeStop(i)} variant="ghost">
                <TrashIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove stop</TooltipContent>
          </Tooltip>
        </div>
      ))}
      <SearchBar
        initialLocation={activeRoute.destination}
        activeRouteId={activeRouteId}
        handleLocationSelect={handleLocationSelect}
        fieldType="destination"
      />
      <div className="grid grid-cols-3">
        <div className="flex flex-col items-center">
          <Button variant="default" size="icon" onClick={addStop}>
            <MapPinPlusIcon size={20} />
          </Button>
          <p>Add new stop</p>
        </div>
      </div>
    </div>
  )
}
