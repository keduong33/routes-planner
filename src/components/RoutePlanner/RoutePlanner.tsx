import { MapPinPlusIcon, TrashIcon } from '@phosphor-icons/react'
import { Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { useCallback, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import type { NormalizedLocation } from '../../api/geo/types'
import type { RouteOption } from '../../types'
import { newRoute } from '../../types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { SearchBar } from '../MapDrawer/SearchBar/SearchBar'

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
    <Flex direction="column" gapY="2" p="1">
      <SearchBar
        initialLocation={activeRoute.startingLocation}
        activeRouteId={activeRouteId}
        handleLocationSelect={handleLocationSelect}
        fieldType="starting"
      />
      {activeRoute.stops.map((stop, i) => (
        <Flex direction="row" gapX="2" align="center">
          <SearchBar
            key={`stop-${i}`}
            initialLocation={stop}
            activeRouteId={activeRouteId}
            handleLocationSelect={handleLocationSelect}
            fieldType="stop"
          />

          <Tooltip content="Remove stop">
            <IconButton onClick={() => removeStop(i)} variant="ghost">
              <TrashIcon size={20} />
            </IconButton>
          </Tooltip>
        </Flex>
      ))}
      <SearchBar
        initialLocation={activeRoute.destination}
        activeRouteId={activeRouteId}
        handleLocationSelect={handleLocationSelect}
        fieldType="destination"
      />
      <Flex direction="row">
        <Flex direction="column" width={{ initial: '50px' }} align="center">
          <Tooltip content="Add new stop">
            <IconButton radius="full" onClick={addStop}>
              <MapPinPlusIcon size={20} />
            </IconButton>
          </Tooltip>
          <Text as="label" size="1" align="center">
            Add new stop
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
