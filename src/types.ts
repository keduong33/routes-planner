import type { Direction } from './api/geo/locationIq/types'
import type { NormalizedLocation } from './api/geo/types'

export type StopEntry = {
  id: string
  location: NormalizedLocation | null
}

export type RouteOption = {
  id: string
  stops: Array<StopEntry>
  direction: Direction | null
  type: 'route' | 'optimized'
}

export function genStopId() {
  return generateId()
}

export function generateId() {
  return crypto.randomUUID()
}

export const newRoute: RouteOption = {
  id: generateId(),
  stops: [
    { id: genStopId(), location: null },
    { id: genStopId(), location: null },
  ],
  direction: null,
  type: 'route',
}
