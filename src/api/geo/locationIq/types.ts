/**
 * Search API types
 */
export interface Location {
  place_id: string
  licence: string
  osm_type: string
  osm_id: string
  boundingbox?: Array<string> | null
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon: string
  address: Address
}
export interface Address {
  attraction: string
  house_number: string
  road: string
  neighbourhood: string
  suburb: string
  county: string
  city: string
  state: string
  postcode: string
  country: string
  country_code: string
}

/**
 * Direction API Types
 */

export interface Direction {
  code: string
  waypoints: Array<Waypoint>
  routes: Array<Route>
}

export interface Waypoint {
  hint?: string
  distance: number
  location: [number, number]
  name: string
}

export type GeoJsonLineString = {
  type: 'LineString'
  coordinates: Array<[number, number]>
}

export interface Route {
  legs: Array<Leg>
  weight_name: string
  geometry: string | GeoJsonLineString
  weight: number
  distance: number
  duration: number
}

export interface Leg {
  steps?: Array<unknown>
  weight: number
  distance: number
  summary: string
  duration: number
}

/**
 * Optimize API response (TSP). Uses "trips" instead of "routes".
 * https://docs.locationiq.com/docs/optimize-api
 */
export interface OptimizeWaypoint extends Waypoint {
  waypoint_index: number
  trips_index: number
}

export interface OptimizeResponse {
  code: string
  waypoints: Array<OptimizeWaypoint>
  trips: Array<Route>
}
