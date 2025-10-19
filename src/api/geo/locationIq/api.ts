import type { NormalizedLocation } from '../types'

const locationIqUrl = 'https://us1.locationiq.com/v1/'
const options = { method: 'GET', headers: { accept: 'application/json' } }

export const locationIqApi = {
  /**
   * https://docs.locationiq.com/reference/search
   */
  async search(query: string): Promise<Array<NormalizedLocation>> {
    // const key = import.meta.env.VITE_LOCATION_IQ
    // const res = await fetch(
    //   `${locationIqUrl}?key=${key}&q=${encodeURIComponent(query)}`,
    //   options,
    // )
    // const data = (await res.json()) as Array<Location>
    const data = locationIqFakeData.search

    return data.map((item) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
    }))
  },
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
