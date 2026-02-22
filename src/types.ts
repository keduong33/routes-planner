import type { Direction } from './api/geo/locationIq/types'
import type { NormalizedLocation } from './api/geo/types'

export type StopEntry = {
  id: string
  location: NormalizedLocation | null
}

export type RouteOption = {
  stops: Array<StopEntry>
  direction: Direction | null
}

export function genStopId() {
  return crypto.randomUUID()
}

export const newRoute: RouteOption = {
  stops: [
    { id: genStopId(), location: null },
    { id: genStopId(), location: null },
  ],
  direction: null,
}
