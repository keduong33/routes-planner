import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, TileLayer } from 'react-leaflet'
import { ControlMenu } from '../components/ControlMenu'
import { FeedbackButton } from '../components/FeedbackButton'
import { MapDrawer } from '../components/MapDrawer/MapDrawer'
import { RouteLayer } from '../components/RouteLayer'
import { RoutePlannerProvider } from '../components/RoutePlanner/RoutePlannerContext'
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

function AppInner() {
  return (
    <div className="w-full">
      <FeedbackButton />
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
        <RouteLayer />
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
