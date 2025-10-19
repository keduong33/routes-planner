import { Button } from '@radix-ui/themes'
import type { LatLng } from 'leaflet'
import { useState } from 'react'
import { Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet'
import { CONTROL_CLASSES } from '../consts'
import { ContextMenu } from './ContextMenu'

export function ControlMenu() {
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState<LatLng | null>(null)
  const [newPosition, setNewPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    contextmenu(e) {
      setNewPosition(e.latlng)
    },
    locationfound(e) {
      map.setView(e.latlng, map.getMaxZoom())
      setPosition(e.latlng)
      setIsLoading(false)
    },
    locationerror(e) {
      console.error(e)
      setIsLoading(false)
    },
  })
  return (
    <>
      <div style={{ bottom: '20px', position: 'absolute', right: '5px' }}>
        <div
          className={CONTROL_CLASSES.control}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            onClick={() => {
              setIsLoading(true)
              setPosition(null)
              map.locate()
            }}
            loading={isLoading}
          >
            Locate
          </Button>
        </div>
      </div>
      {position && (
        <Marker position={position}>
          <Tooltip permanent>You are here</Tooltip>
        </Marker>
      )}
      {newPosition && (
        <Popup position={newPosition}>
          <ContextMenu />
        </Popup>
      )}
    </>
  )
}
