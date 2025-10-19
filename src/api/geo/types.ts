export type NormalizedRoute = {
  distanceKm: number
  durationMin: number
  waypoints: Array<{ lat: number; lng: number }>
}

export type NormalizedLocation = {
  name: string
  lat: number
  lon: number
  displayName: string
}
