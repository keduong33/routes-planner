import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { MarkerProps } from 'react-leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { ControlMenu } from '../components/ControlMenu'
import { MapDrawer } from '../components/MapDrawer/MapDrawer'
import { SearchBar } from '../components/SearchBar/SearchBar'

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <MapDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <MapContainer
        center={[0, 0]}
        zoom={0}
        scrollWheelZoom={true}
        style={{
          height: window.innerHeight,
          width: '100%',
        }}
        zoomControl={false}
      >
        <TileLayer
          attribution={`&copy; ${chosenTile.attribution}`}
          url={chosenTile.url}
        />
        {markers.map((marker) => (
          <Marker {...marker} />
        ))}
        <SearchBar setDrawerOpen={setDrawerOpen} />
        <ControlMenu />
      </MapContainer>
    </div>
  )
}
