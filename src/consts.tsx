export const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

export const CONTROL_CLASSES = {
  control: 'leaflet-control',
}

export const colors = [
  '#872361',
  '#e00b55',
  '#ff691f',
  '#feb43c',
  '#00e988',
  '#2bbaa0',
  '#22218f',
  '#4e2bd6',
  '#8747ff',
  '#bd70ff',
  '#ff6bce',
  '#ff3377',
  '#5a87f0',
  '#9b83c8',
  '#2b2045',
  '#1a3f55', // deep teal
  '#ff4a00', // bright orange-red
  '#8c1f99', // dark magenta
  '#006644', // forest green
  '#4433aa', // deep indigo
  '#d6457b', // raspberry
  '#ff8c1a', // warm orange
  '#0077cc', // strong blue
  '#993366', // dark pink/purple
  '#334455', // muted navy
]

export const randomizeColor = () =>
  colors[Math.floor(Math.random() * colors.length)]
