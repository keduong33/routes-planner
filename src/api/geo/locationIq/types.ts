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
  waypoints: Waypoints
  routes: Routes
}
export interface Waypoints {
  distance: number
  location?: Array<number> | null
  name: string
}
export interface Routes {
  legs: Legs
  weight_name: string
  geometry: string
  weight: number
  distance: number
  duration: number
}
export interface Legs {
  steps?: Array<null> | null
  weight: number
  distance: number
  summary: string
  duration: number
}
