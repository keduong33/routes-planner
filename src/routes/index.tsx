import { createFileRoute } from '@tanstack/react-router'
import type { LatLng } from 'leaflet'
import { useState } from 'react'
import type { MarkerProps } from 'react-leaflet'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
  useMapEvents,
} from 'react-leaflet'

const tiles = [
  {
    attribution:
      '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
]

export const Route = createFileRoute('/')({
  component: App,
})

function CurrentLocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getMaxZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

function ContextMenu({
  markers,
  setMarkers,
}: {
  markers: Array<MarkerProps>
  setMarkers: (markers: Array<MarkerProps>) => void
}) {
  useMapEvent('contextmenu', (e) => {
    console.log(e.latlng)
  })
  return null // This component doesn’t render anything itself
}

function App() {
  const [markers, setMarkers] = useState<Array<MarkerProps>>([])
  return (
    <MapContainer
      center={[0, 0]}
      zoom={0}
      scrollWheelZoom={true}
      style={{ height: window.innerHeight }}
    >
      <TileLayer
        attribution={`&copy; ${tiles[0].attribution}`}
        url={tiles[0].url}
      />
      {markers.map((marker) => (
        <Marker {...marker} />
      ))}
      <CurrentLocationMarker />
      <ContextMenu markers={markers} setMarkers={setMarkers} />
    </MapContainer>
  )
}
