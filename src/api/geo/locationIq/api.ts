import type { RouteOption } from '../../../types'
import type { NormalizedLocation } from '../types'
import type { Location } from './types'

const locationIqUrl = 'https://us1.locationiq.com/v1/'
const options = { method: 'GET', headers: { accept: 'application/json' } }
const key = import.meta.env.VITE_LOCATION_IQ

export const locationIqApi = {
  /**
   * https://docs.locationiq.com/reference/search
   */
  async search(query: string): Promise<Array<NormalizedLocation>> {
    const res = await fetch(
      `${locationIqUrl}search?key=${key}&q=${encodeURIComponent(query)}&format=json`,
      options,
    )
    const data = (await res.json()) as Array<Location>

    return data.map((item) => ({
      id: item.place_id,
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
    }))
  },

  async getDirections(route: RouteOption) {
    if (route.stops.length + 2 > 25) {
      throw new Error('Exceed maximum of 25 locations')
    }

    if (!route.startingLocation || !route.destination) {
      throw new Error('No starting location/destination')
    }

    let coordinates = convertToCoordinates(route.startingLocation)

    route.stops.forEach((stop) => {
      if (stop) coordinates += `;${convertToCoordinates(stop)}`
    })

    coordinates += `;${convertToCoordinates(route.destination)}`

    const res = await fetch(
      `${locationIqUrl}directions/driving/${coordinates}?key=${key}&steps=false&geometries=geojson`,
      options,
    )

    return res
  },
}

function convertToCoordinates(location: NormalizedLocation) {
  return `${location.lon},${location.lat}`
}

const locationIqFakeData = {
  search: [
    {
      place_id: '116136978',
      licence: 'https://locationiq.com/attribution',
      osm_type: 'way',
      osm_id: '34633854',
      boundingbox: ['40.7479255', '40.7489585', '-73.9865012', '-73.9848166'],
      lat: '40.74844205',
      lon: '-73.98565890160751',
      display_name:
        'Empire State Building, 350, 5th Avenue, Manhattan Community Board 5, Manhattan, New York County, New York, New York, 10001, USA',
      class: 'tourism',
      type: 'attraction',
      importance: 0.8515868466874569,
      icon: 'https://locationiq.org/static/images/mapicons/poi_point_of_interest.p.20.png',
      address: {
        attraction: 'Empire State Building',
        house_number: '350',
        road: '5th Avenue',
        neighbourhood: 'Manhattan Community Board 5',
        suburb: 'Manhattan',
        county: 'New York County',
        city: 'New York',
        state: 'New York',
        postcode: '10001',
        country: 'United States of America',
        country_code: 'us',
      },
    },
    {
      place_id: '116136978',
      licence: 'https://locationiq.com/attribution',
      osm_type: 'way',
      osm_id: '34633854',
      boundingbox: ['40.7479255', '40.7489585', '-73.9865012', '-73.9848166'],
      lat: '40.74844205',
      lon: '-73.98565890160751',
      display_name:
        'Empire State Building, 350, 5th Avenue, Manhattan Community Board 5, Manhattan, New York County, New York, New York, 10001, USA',
      class: 'tourism',
      type: 'attraction',
      importance: 0.8515868466874569,
      icon: 'https://locationiq.org/static/images/mapicons/poi_point_of_interest.p.20.png',
      address: {
        attraction: 'Empire State Building',
        house_number: '350',
        road: '5th Avenue',
        neighbourhood: 'Manhattan Community Board 5',
        suburb: 'Manhattan',
        county: 'New York County',
        city: 'New York',
        state: 'New York',
        postcode: '10001',
        country: 'United States of America',
        country_code: 'us',
      },
    },
  ],
}
