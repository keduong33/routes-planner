import { locationIqApi } from './locationIq/api'

type Provider = 'locationiq' | 'ors'

export function createGeoApi(provider: Provider) {
  switch (provider) {
    case 'locationiq':
      return locationIqApi
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
