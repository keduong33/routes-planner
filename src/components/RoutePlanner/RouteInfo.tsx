import {
  formatDuration as formatDurationDateFns,
  intervalToDuration,
} from 'date-fns'
import { useMemo } from 'react'
import type { Direction } from '../../api/geo/locationIq/types'
import type { RouteOption } from '../../types'
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

function consolidateLegs({
  activeRoute,
  direction,
}: {
  activeRoute: RouteOption | undefined
  direction: Direction | undefined
}) {
  if (!activeRoute || !direction || !direction.routes.length) return null
  const route = direction.routes[0]
  const legs = route.legs

  if (!activeRoute.startingLocation || !activeRoute.destination) return null

  const stops = activeRoute.stops.filter((stop) => !!stop)

  const locations = [
    activeRoute.startingLocation,
    ...stops,
    activeRoute.destination,
  ]

  if (!legs.length || legs.length !== locations.length - 1) return null

  const labels = locations.map((_, index) => {
    if (index === 0) return 'Starting'
    if (index === locations.length - 1) return 'Destination'
    return `Stop ${index}`
  })

  return legs.map((leg, index) => ({
    from: labels[index],
    to: labels[index + 1],
    durationSeconds: leg.duration,
  }))
}

export function RouteInfo() {
  const { activeRoute, direction, isDirectionFetching } = useRoutePlanner()

  const legsWithLabels = useMemo(() => {
    return consolidateLegs({ activeRoute, direction })
  }, [activeRoute, direction])

  const totalDurationSeconds = useMemo(() => {
    if (!direction || !direction.routes.length) return undefined
    return direction.routes[0].duration
  }, [direction])

  return (
    <div>
      <p className="font-bold text-md italic">Route info</p>

      {isDirectionFetching && (
        <p className="text-sm text-muted-foreground">Calculating route...</p>
      )}

      {!isDirectionFetching && !legsWithLabels && (
        <p className="text-sm text-muted-foreground">
          Calculate a route to see timing details.
        </p>
      )}

      {!isDirectionFetching && legsWithLabels && (
        <div className="mt-2 space-y-1 text-sm">
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

          <div className="mt-2 flex flex-row justify-between border-t pt-2 text-sm font-semibold">
            <span>Overall duration</span>
            <span>{formatDuration()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            (Disclaimer: ETA could be inaccurate)
          </p>
        </div>
      )}
    </div>
  )
}
