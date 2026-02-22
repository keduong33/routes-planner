import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import {
  formatDuration as formatDurationDateFns,
  intervalToDuration,
} from 'date-fns'
import { useMemo, useState } from 'react'
import type { Route } from '../../api/geo/locationIq/types'
import type { RouteOption } from '../../types'
import { ScrollArea } from '../ui/scroll-area'
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

function getLocationLabels(routeOption: RouteOption) {
  if (!routeOption.startingLocation || !routeOption.destination) return null
  const stops = routeOption.stops.filter((stop) => !!stop)
  const locations = [
    routeOption.startingLocation,
    ...stops,
    routeOption.destination,
  ]
  return locations.map((_, index) => {
    if (index === 0) return 'Starting'
    if (index === locations.length - 1) return 'Destination'
    return `Stop ${index}`
  })
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
    from: labels[index],
    to: labels[index + 1],
    durationSeconds: leg.duration,
  }))
}

function RouteOptionCard({
  routeOption,
  displayIndex,
}: {
  routeOption: RouteOption
  displayIndex: number
}) {
  const { setActiveRoute } = useRoutePlanner()
  const [isExpanded, setIsExpanded] = useState(false)
  const route = routeOption.direction!.routes[0]
  const legsWithLabels = useMemo(
    () => consolidateLegsForRoute({ routeOption, route }),
    [routeOption, route],
  )

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const selectActiveRoute = () => {
    setActiveRoute(routeOption)
  }

  return (
    <div
      className="rounded-lg border border-border bg-card p-3 text-left shadow-sm hover:cursor-pointer"
      tabIndex={0}
      onClick={selectActiveRoute}
    >
      <div
        role="button"
        className="flex flex-row items-center justify-between gap-2 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring rounded -m-1 p-1"
      >
        <p className="font-medium">Route {displayIndex + 1}</p>
        <div className="flex flex-row items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {formatDuration(route.duration)} · {formatDistance(route.distance)}
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
              <span>
                {leg.from} → {leg.to}
              </span>
              <span className="font-medium">
                {formatDuration(leg.durationSeconds)}
              </span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            (Disclaimer: ETA could be inaccurate)
          </p>
        </div>
      )}
    </div>
  )
}

export function RouteInfo() {
  const { routeOptions } = useRoutePlanner()

  const routeOptionsWithDirection = useMemo(
    () =>
      routeOptions.filter(
        (ro) => ro.direction && ro.direction.routes.length > 0,
      ),
    [routeOptions],
  )

  const hasAnyCalculatedRoutes = routeOptionsWithDirection.length > 0

  if (!hasAnyCalculatedRoutes) {
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
    <div className="flex flex-col h-full min-h-0">
      <p className="font-bold text-md italic shrink-0">Route info</p>
      <ScrollArea className="mt-2 flex-1 min-h-0">
        <div className="space-y-2 pr-2">
          {routeOptionsWithDirection.map((routeOption, index) => (
            <RouteOptionCard
              key={`Route #${index}`}
              routeOption={routeOption}
              displayIndex={index}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
