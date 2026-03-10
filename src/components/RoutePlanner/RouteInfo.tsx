import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useCallback, useState } from 'react'
import { arrayMove } from '../../lib/utils'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { useRoutePlanner } from './RoutePlannerContext'
import { SortableRouteOptionCard } from './SortableRouteOptionCard'

export function RouteInfo() {
  const { routeOptions, setRouteOptions } = useRoutePlanner()
  const [isReordering, setIsReordering] = useState(false)

  const hasRouteOptions = routeOptions.length > 0

  const handleDragEnd: DragEndEvent = useCallback(
    (event) => {
      console.log(event)
      if (event.canceled) return
      const source = event.operation.source
      if (!isSortable(source)) return

      const { initialIndex, index: toIndex } = source
      if (initialIndex === toIndex) return
      setRouteOptions((prev) => arrayMove(prev, initialIndex, toIndex))
    },
    [setRouteOptions],
  )

  const handleReorder = useCallback(() => {
    setIsReordering((prev) => !prev)
  }, [])

  if (!hasRouteOptions) {
    return (
      <div>
        <p className="font-bold text-md italic">Route info</p>
        <p className="text-sm text-muted-foreground">
          Calculate a route to see timing details.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-md italic shrink-0">Route info</p>
        <Button variant="ghost" onClick={handleReorder}>
          {isReordering ? 'Done' : 'Edit'}
        </Button>
      </div>
      <ScrollArea className="mt-2 flex-1 min-h-0">
        <div className="space-y-2 pr-2">
          <DragDropProvider onDragEnd={handleDragEnd}>
            {routeOptions.map((routeOption, index) => (
              <SortableRouteOptionCard
                key={routeOption.id}
                routeOption={routeOption}
                displayIndex={index}
                isReordering={isReordering}
              />
            ))}
          </DragDropProvider>
        </div>
      </ScrollArea>
    </div>
  )
}
