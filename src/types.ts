import type { UUIDTypes } from 'uuid'
import { v4 as uuidv4 } from 'uuid'
import type { NormalizedLocation } from './api/geo/types'

export type RouteOption = {
  id: UUIDTypes
  startingLocation: NormalizedLocation | null
  stops: Array<NormalizedLocation | null>
  destination: NormalizedLocation | null
}

export const newRoute: RouteOption = {
  id: uuidv4(),
  startingLocation: null,
  stops: [],
  destination: null,
}
