import { useSortable } from '@dnd-kit/react/sortable'
import { CaretDownIcon, CaretUpIcon, CircleIcon } from '@phosphor-icons/react'
import {
  formatDuration as formatDurationDateFns,
  intervalToDuration,
} from 'date-fns'
import { useMemo, useState } from 'react'
import type { Route } from '../../api/geo/locationIq/types'
import { isEmptyString } from '../../lib/utils'
import type { RouteOption } from '../../types'
import { DeleteButton } from '../DeleteButton'
import { DragButton } from '../DragButton'
import { useRoutePlanner } from './RoutePlannerContext'

function formatDuration(seconds: number | undefined) {
  if (!seconds || seconds <= 0) return '0 min'

  const duration = intervalToDuration({
    start: 0,
    end: seconds * 1000,
  })

  return `~${formatDurationDateFns(
    {
      hours: duration.hours,
      minutes: duration.minutes,
    },
    { format: ['hours', 'minutes'] },
  )}`
}

function formatDistance(meters: number | undefined) {
  if (!meters || meters <= 0) return '0 km'
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

/** Returns one label per defined stop (in order); used for leg labels. */
function getLocationLabels(routeOption: RouteOption) {
  return routeOption.direction?.waypoints.map((wp) => wp.name)
}

function consolidateLegsForRoute({
  routeOption,
  route,
}: {
  routeOption: RouteOption
  route: Route
}) {
  const labels = getLocationLabels(routeOption)
  if (!labels || !route.legs.length || route.legs.length !== labels.length - 1)
    return null

  return route.legs.map((leg, index) => ({
    from: !isEmptyString(labels[index])
      ? labels[index]
      : routeOption.stops[index].location?.name,
    to: !isEmptyString(labels[index + 1])
      ? labels[index + 1]
      : routeOption.stops[index + 1].location?.name,
    durationSeconds: leg.duration,
  }))
}

export function SortableRouteOptionCard({
  routeOption,
  index,
  isReordering: isEditing,
}: {
  routeOption: RouteOption
  index: number
  isReordering: boolean
}) {
  const { setActiveRoute, setRouteOptions } = useRoutePlanner()
  const [isExpanded, setIsExpanded] = useState(false)
  const route = routeOption.direction!.routes[0]
  const legsWithLabels = useMemo(
    () => consolidateLegsForRoute({ routeOption, route }),
    [routeOption, route],
  )

  const routeLabel = useMemo(() => {
    if (!legsWithLabels || legsWithLabels.length === 0) {
      return `Route ${index + 1}`
    }

    const firstLeg = legsWithLabels[0]
    const lastLeg = legsWithLabels[legsWithLabels.length - 1]

    return `${firstLeg.from} → ${lastLeg.to}`
  }, [legsWithLabels, index])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const selectActiveRoute = () => {
    setActiveRoute(routeOption)
  }

  const removeRouteOption = () => {
    setRouteOptions((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })
  }

  const { ref, handleRef, isDragging } = useSortable({
    id: routeOption.id,
    index,
    disabled: !isEditing,
  })

  return (
    <div ref={ref} className="flex flex-row gap-1 items-center">
      {isEditing && <DragButton handleRef={handleRef} />}
      <div
        className={`flex-1 rounded-lg border border-border bg-card p-3 text-left shadow-sm hover:cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
        tabIndex={0}
        onClick={selectActiveRoute}
      >
        <div
          role="button"
          className="flex flex-row items-center justify-between gap-2 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring rounded -m-1 p-1"
        >
          <div className="flex flex-col">
            <p className="font-medium">{routeLabel}</p>
            {routeOption.type === 'optimized' && (
              <p className="text-xs font-semibold text-emerald-600">
                {' (Best)'}
              </p>
            )}
          </div>
          <CircleIcon size={20} weight="fill" color={routeOption.color} />
          <div className="flex flex-row items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {formatDuration(route.duration)} ·{' '}
              {formatDistance(route.distance)}
            </span>
            <button
              type="button"
              onClick={handleToggle}
              className="text-muted-foreground hover:text-foreground p-0.5 -m-0.5"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <CaretUpIcon size={20} />
              ) : (
                <CaretDownIcon size={20} />
              )}
            </button>
          </div>
        </div>
        {isExpanded && legsWithLabels && (
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            {legsWithLabels.map((leg, index) => (
              <div
                key={`${leg.from}-${leg.to}-${index}`}
                className="flex flex-row justify-between gap-x-2"
              >
                <p className="line-clamp-1">{`${leg.from} -> ${leg.to}`}</p>
                <span className="font-medium flex-shrink-0">
                  {formatDuration(leg.durationSeconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {isEditing && <DeleteButton onRemove={removeRouteOption} />}
    </div>
  )
}
