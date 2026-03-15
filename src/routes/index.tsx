import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { ControlMenu } from '../components/ControlMenu'
import { FeedbackButton } from '../components/FeedbackButton'
import { MapDrawer } from '../components/MapDrawer/MapDrawer'
import { RouteLayer } from '../components/RouteLayer'
import { RoutePlannerProvider } from '../components/RoutePlanner/RoutePlannerContext'
import { Button } from '../components/ui/button'
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
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-screen w-full">
      <MapDrawer open={open} setOpen={setOpen} />
      <FeedbackButton />

      <div className="flex-1 relative">
        {!open && (
          <Button
            className="absolute top-2 left-2 z-[800]"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <MagnifyingGlassIcon size={20} />
          </Button>
        )}

        <MapContainer
          center={[0, 0]}
          zoom={0}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={false}
          doubleClickZoom={false}
        >
          <MapResizeHandler open={open} />
          <TileLayer
            attribution={`&copy; ${chosenTile.attribution}`}
            url={chosenTile.url}
          />
          <RouteLayer />
          <ControlMenu />
        </MapContainer>
      </div>
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

function MapResizeHandler({ open }: { open: boolean }) {
  const map = useMap()

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize()
    }, 300)

    return () => clearTimeout(timeout)
  }, [open, map])

  return null
}
