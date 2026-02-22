import { useSortable } from '@dnd-kit/react/sortable'
import { DotsSixVerticalIcon, TrashIcon } from '@phosphor-icons/react'
import type { NormalizedLocation } from '../../api/geo/types'
import type { FieldType } from '../MapDrawer/SearchBar/SearchBar'
import { SearchBar } from '../MapDrawer/SearchBar/SearchBar'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function SortableStopRow({
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
