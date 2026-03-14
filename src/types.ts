import type { Direction } from './api/geo/locationIq/types'
import type { NormalizedLocation } from './api/geo/types'
import { randomizeColor } from './consts'
import { generateId } from './lib/utils'

export type StopEntry = {
  id: string
  location: NormalizedLocation | null
}

export type RouteOption = {
  id: string
  stops: Array<StopEntry>
  direction: Direction | null
  type: 'route' | 'optimized'
  color?: string
}

export const generateNewRoute = (): RouteOption => {
  return {
    id: generateId(),
    stops: [
      { id: generateId(), location: null },
      { id: generateId(), location: null },
    ],
    direction: null,
    type: 'route',
    color: randomizeColor(),
  }
}
