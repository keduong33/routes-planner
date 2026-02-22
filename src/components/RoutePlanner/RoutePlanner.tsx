import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import {
  CalculatorIcon,
  DotsSixVerticalIcon,
  MapPinPlusIcon,
  PathIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useCallback } from 'react'
import type { NormalizedLocation } from '../../api/geo/types'
import { genStopId } from '../../types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { SearchBar } from '../MapDrawer/SearchBar/SearchBar'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { RouteInfo } from './RouteInfo'
import { useRoutePlanner } from './RoutePlannerContext'

function arrayMove<T>(arr: Array<T>, from: number, to: number): Array<T> {
  const newItems = [...arr]
  const [removed] = newItems.splice(from, 1)
  newItems.splice(to, 0, removed)
  return newItems
}

function SortableStopRow({
  stop,
  stopIndex,
  fieldType,
  onLocationSelect,
  onRemove,
  canRemove,
}: {
  stop: { id: string; location: NormalizedLocation | null }
  stopIndex: number
  fieldType: FieldType
  onLocationSelect: (location: NormalizedLocation, stopIndex?: number) => void
  onRemove: (i: number) => void
  canRemove: boolean
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: stop.id,
    index: stopIndex,
  })

  return (
    <div
      ref={ref}
      className={`flex flex-row gap-x-2 items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={handleRef}
            size="icon"
            variant="ghost"
            className="cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <DotsSixVerticalIcon size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Drag to reorder</TooltipContent>
      </Tooltip>
      <SearchBar
        initialLocation={stop.location}
        handleLocationSelect={onLocationSelect}
        stopIndex={stopIndex}
        fieldType={fieldType}
      />
      {canRemove ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => onRemove(stopIndex)}
              variant="ghost"
            >
              <TrashIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove stop</TooltipContent>
        </Tooltip>
      ) : (
        <Button size="icon" className="invisible">
          <TrashIcon size={20} />
        </Button>
      )}
    </div>
  )
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

  const getFieldType = (i: number): FieldType => {
    if (i === 0) return 'starting'
    if (i === activeRoute.stops.length - 1) return 'destination'
    return 'stop'
  }

  return (
    <div className="flex flex-col gap-y-3 h-screen min-h-0">
      <DragDropProvider onDragEnd={handleDragEnd}>
        {activeRoute.stops.map((stop, i) => (
          <SortableStopRow
            key={stop.id}
            stop={stop}
            stopIndex={i}
            fieldType={getFieldType(i)}
            onLocationSelect={handleLocationSelect}
            onRemove={removeStop}
            canRemove={activeRoute.stops.length > 2}
          />
        ))}
      </DragDropProvider>

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
