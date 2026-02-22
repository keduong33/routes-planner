import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { ControlMenu } from '../components/ControlMenu'
import { MapDrawer } from '../components/MapDrawer/MapDrawer'
import {
  RoutePlannerProvider,
  useRoutePlanner,
} from '../components/RoutePlanner/RoutePlannerContext'
import { TooltipProvider } from '../components/ui/tooltip'

const tiles: Array<{ attribution: string; url: string }> = [
  {
    attribution:
      '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    attribution:
      '<a href="https://locationiq.com/?ref=maps"> LocationIQ Maps </a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.vector?key=${import.meta.env.VITE_LOCATION_IQ}`,
  },
]

const chosenTile = tiles[0]

export const Route = createFileRoute('/')({
  component: App,
})

function RoutePolyline() {
  const { routeOptions } = useRoutePlanner()

  const allLatLongs = useMemo(() => {
    return routeOptions
      .map((routeOption) => {
        const geom = routeOption.direction?.routes[0].geometry
        if (!geom || typeof geom === 'string') return null
        return geom.coordinates.map(
          ([lon, lat]) => [lat, lon] as [number, number],
        )
      })
      .filter((latLong) => latLong !== null)
  }, [routeOptions])

  //   useEffect(() => {
  //     if (allLatLongs.length == 0) return
  //     map.fitBounds(allLatLongs[0], { padding: [20, 20] })
  //   }, [allLatLongs, map])

  return (
    <Polyline
      positions={allLatLongs}
      pathOptions={{ color: '#2563eb', weight: 5 }}
    />
  )
}

function RouteMarkers() {
  const { activeRoute } = useRoutePlanner()

  const points = useMemo(() => {
    return activeRoute.stops
      .map((s) => s.location)
      .filter((l): l is NonNullable<typeof l> => l != null)
      .map((l) => [l.lat, l.lon] as [number, number])
  }, [activeRoute])

  return (
    <>
      {points.map((pos, i) => (
        <Marker key={`route-point-${i}`} position={pos} />
      ))}
    </>
  )
}

function AppInner() {
  return (
    <div className="w-full">
      <MapDrawer />
      <MapContainer
        center={[0, 0]}
        zoom={0}
        scrollWheelZoom={true}
        className="h-screen w-full"
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution={`&copy; ${chosenTile.attribution}`}
          url={chosenTile.url}
        />
        <RouteMarkers />
        <RoutePolyline />
        <ControlMenu />
      </MapContainer>
    </div>
  )
}

function App() {
  return (
    <TooltipProvider>
      <RoutePlannerProvider>
        <AppInner />
      </RoutePlannerProvider>
    </TooltipProvider>
  )
}
