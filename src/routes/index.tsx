import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { MarkerProps } from 'react-leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { ControlMenu } from '../components/ControlMenu'
import { MapDrawer } from '../components/MapDrawer/MapDrawer'
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

function App() {
  const [markers, setMarkers] = useState<Array<MarkerProps>>([])
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* {!drawerOpen && <SearchBar setDrawerOpen={setDrawerOpen} mode="map" />} */}
        <MapDrawer open={drawerOpen} setOpen={setDrawerOpen} />
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
          {markers.map((marker) => (
            <Marker {...marker} />
          ))}

          <ControlMenu />
        </MapContainer>
      </div>
    </TooltipProvider>
  )
}
