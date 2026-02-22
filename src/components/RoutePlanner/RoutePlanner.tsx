import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useCallback } from 'react'
import type { NormalizedLocation } from '../../api/geo/types'
import { genStopId } from '../../types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { RouteInfo } from './RouteInfo'
import { useRoutePlanner } from './RoutePlannerContext'
import { RouteUtilities } from './RouteUtilities'
import { SortableStopRow } from './SortableStopRow'

function arrayMove<T>(arr: Array<T>, from: number, to: number): Array<T> {
  const newItems = [...arr]
  const [removed] = newItems.splice(from, 1)
  newItems.splice(to, 0, removed)
  return newItems
}

function getFieldType(i: number, routeLength: number): FieldType {
  if (i === 0) return 'starting'
  if (i === routeLength - 1) return 'destination'
  return 'stop'
}

export function RoutePlanner() {
  const {
    setActiveRoute,
    activeRoute,
    calculateRoute,
    calculateOptimizedRoute,
  } = useRoutePlanner()

  const handleLocationSelect = useCallback(
    (location: NormalizedLocation, stopIndex?: number) => {
      if (stopIndex === undefined) return
      setActiveRoute((prev) => {
        const newStops = [...prev.stops]
        const entry = newStops[stopIndex]
        newStops[stopIndex] = { ...entry, location }
        return { ...prev, stops: newStops }
      })
    },
    [setActiveRoute],
  )

  const addStop = useCallback(() => {
    setActiveRoute((prev) => ({
      ...prev,
      stops: [
        ...prev.stops.slice(0, -1),
        { id: genStopId(), location: null },
        prev.stops[prev.stops.length - 1],
      ],
    }))
  }, [setActiveRoute])

  const removeStop = useCallback(
    (stopIndex: number) => {
      setActiveRoute((prev) => {
        if (prev.stops.length <= 2) return prev
        return {
          ...prev,
          stops: prev.stops.filter((_, i) => i !== stopIndex),
        }
      })
    },
    [setActiveRoute],
  )

  const handleDragEnd: DragEndEvent = useCallback(
    (event) => {
      if (event.canceled) return
      const source = event.operation.source
      if (!isSortable(source)) return

      const { initialIndex, index: toIndex } = source
      if (initialIndex === toIndex) return
      setActiveRoute((prev) => ({
        ...prev,
        stops: arrayMove(prev.stops, initialIndex, toIndex),
      }))
    },
    [setActiveRoute],
  )

  const handleCalculateRoute = useCallback(() => {
    void calculateRoute()
  }, [calculateRoute])

  const handleCalculateOptimizedRoute = useCallback(() => {
    void calculateOptimizedRoute()
  }, [calculateOptimizedRoute])

  return (
    <div className="flex flex-col gap-y-3 h-screen min-h-0">
      <DragDropProvider onDragEnd={handleDragEnd}>
        {activeRoute.stops.map((stop, i) => (
          <SortableStopRow
            key={stop.id}
            stop={stop}
            stopIndex={i}
            fieldType={getFieldType(i, activeRoute.stops.length)}
            onLocationSelect={handleLocationSelect}
            onRemove={removeStop}
            canRemove={activeRoute.stops.length > 2}
          />
        ))}
      </DragDropProvider>

      <RouteUtilities
        addStop={addStop}
        handleCalculateRoute={handleCalculateRoute}
        handleCalculateOptimizedRoute={handleCalculateOptimizedRoute}
      />

      <RouteInfo />
    </div>
  )
}
