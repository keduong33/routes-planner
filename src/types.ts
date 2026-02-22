import type { Direction } from './api/geo/locationIq/types'
import type { NormalizedLocation } from './api/geo/types'

export type RouteOption = {
  startingLocation: NormalizedLocation | null
  stops: Array<NormalizedLocation | null>
  destination: NormalizedLocation | null
  direction: Direction | null
}

export const newRoute: RouteOption = {
  startingLocation: null,
  stops: [],
  destination: null,
  direction: null,
}
