import { useEffect } from 'react'
import { CircleMarker, Marker, Polyline, useMap } from 'react-leaflet'
import { createDestinationMarker } from '../leaflet.consts'
import type { RouteOption } from '../types'
import { useRoutePlanner } from './RoutePlanner/RoutePlannerContext'

function AllRoutes() {
  const { routeOptions, activeRoute } = useRoutePlanner()

  const sortedRoutes = routeOptions.slice().sort((a, b) => {
    if (a.id === activeRoute.id) return 1
    if (b.id === activeRoute.id) return -1
    return 0
  })

  return (
    <>
      {sortedRoutes.map((routeOption) => {
        // --- Polyline ---
        const geom = routeOption.direction?.routes[0].geometry
        if (!geom || typeof geom === 'string') return null

        const coords = geom.coordinates.map(
          ([lon, lat]) => [lat, lon] as [number, number],
        )

        return (
          <div key={`route-${routeOption.id}`}>
            <Polyline
              positions={coords}
              pathOptions={{ color: routeOption.color, weight: 5 }}
            />
            <Markers routeOption={routeOption} />
          </div>
        )
      })}
    </>
  )
}

function ActiveRoute() {
  const { activeRoute } = useRoutePlanner()
  const map = useMap()

  // Pan/zoom to activeRoute only
  useEffect(() => {
    const activePoints = activeRoute.stops
      .map((s) => s.location)
      .filter((l): l is NonNullable<typeof l> => l != null)
      .map((l) => [l.lat, l.lon] as [number, number])

    if (activePoints.length > 0) {
      map.fitBounds(activePoints, { padding: [30, 30] })
    }
  }, [activeRoute, map])

  return <Markers routeOption={activeRoute} />
}

export function RouteLayer() {
  return (
    <>
      <ActiveRoute />
      <AllRoutes />
    </>
  )
}

function Markers({ routeOption }: { routeOption: RouteOption }) {
  const stops = routeOption.stops
    .map((s) => s.location)
    .filter((l): l is NonNullable<typeof l> => l != null)

  const markers = stops.map((loc, i) => {
    const isDestination = i === stops.length - 1

    if (isDestination) {
      return (
        <Marker
          key={`destination:${routeOption.id}:${i}`}
          position={[loc.lat, loc.lon]}
          icon={createDestinationMarker('red')}
        />
      )
    }

    return (
      <CircleMarker
        key={`marker:${routeOption.id}:${i}`}
        center={[loc.lat, loc.lon]}
        color="black"
        radius={5}
      />
    )
  })

  return markers
}
