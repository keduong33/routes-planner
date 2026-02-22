import {
  CalculatorIcon,
  MapPinPlusIcon,
  PathIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useCallback } from 'react'
import type { NormalizedLocation } from '../../api/geo/types'
import type { RouteOption } from '../../types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { SearchBar } from '../MapDrawer/SearchBar/SearchBar'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { RouteInfo } from './RouteInfo'
import { useRoutePlanner } from './RoutePlannerContext'

export function RoutePlanner() {
  const {
    setRouteOptions,
    setActiveRoute,
    activeRoute,
    calculateRoute,
    calculateOptimizedRoute,
  } = useRoutePlanner()

  const handleLocationSelect = useCallback(
    (
      fieldType: FieldType,
      location: NormalizedLocation,
      stopIndex?: number,
    ) => {
      setActiveRoute((prev) => {
        if (fieldType === 'starting') {
          return {
            ...prev,
            startingLocation: location,
          } satisfies RouteOption
        } else if (fieldType === 'destination') {
          return {
            ...prev,
            destination: location,
          } satisfies RouteOption
        } else if (stopIndex !== undefined) {
          const newStops = [...prev.stops]
          newStops[stopIndex] = location
          return { ...prev, stops: newStops } satisfies RouteOption
        } else return prev
      })
    },
    [],
  )

  const addStop = useCallback(() => {
    setActiveRoute((prev) => {
      return {
        ...prev,
        stops: [...prev.stops, null],
      }
    })
  }, [])

  const removeStop = useCallback((stopIndex: number) => {
    setActiveRoute((prev) => {
      return {
        ...prev,
        stops: prev.stops.filter((_, i) => i !== stopIndex),
      }
    })
  }, [])

  const handleCalculateRoute = useCallback(() => {
    void calculateRoute()
  }, [calculateRoute])

  return (
    <div className="flex flex-col gap-y-3 h-screen min-h-0">
      {/* Starting location */}
      <div className="flex flex-row gap-x-2">
        <SearchBar
          initialLocation={activeRoute.startingLocation}
          handleLocationSelect={handleLocationSelect}
          fieldType="starting"
        />

        {/* Useless button to reserve space */}
        <Button size="icon" className="invisible ">
          <TrashIcon size={20} />
        </Button>
      </div>

      {/* Stops */}
      {activeRoute.stops.map((stop, i) => (
        <div key={`stop-${i}`} className="flex flex-row gap-x-2 items-center">
          <SearchBar
            initialLocation={stop}
            handleLocationSelect={handleLocationSelect}
            stopIndex={i}
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

      {/* Destination */}
      <div className="flex flex-row gap-x-2">
        <SearchBar
          initialLocation={activeRoute.destination}
          handleLocationSelect={handleLocationSelect}
          fieldType="destination"
        />
        {/* Useless button to reserve space */}
        <Button size="icon" className="invisible ">
          <TrashIcon size={20} />
        </Button>
      </div>

      {/* Utilities */}
      <div className="grid grid-cols-3">
        <div className="flex flex-col items-center">
          <Button variant="default" size="icon" onClick={addStop}>
            <MapPinPlusIcon size={20} />
          </Button>
          <p>Add new stop</p>
        </div>
        <div className="flex flex-col items-center">
          <Button variant="default" size="icon" onClick={handleCalculateRoute}>
            <CalculatorIcon size={20} />
          </Button>
          <p>Calculate route</p>
        </div>
        <div className="flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                onClick={() => void calculateOptimizedRoute()}
              >
                <PathIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Find the shortest route (optimize order)
            </TooltipContent>
          </Tooltip>
          <p>Best route</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <RouteInfo />
      </div>
    </div>
  )
}
