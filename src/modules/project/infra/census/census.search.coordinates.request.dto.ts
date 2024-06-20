import got from 'got'
import { CensusResponseDto } from './census.response.dto'
import { Injectable } from '@nestjs/common'
import { CensusCounties, CensusCountySubdivisions, CensusPlace, CensusState } from './census.type.dto'

/**
 * TODO: 검색 결과가 없는 상황에서 Mapbox를 이용해 어디까지의 정보를 입력받을 수 있는가?
 * Census 검색 결과가 없을 경우 Barun DB에서 검색 결과를 반환하고
 * UI에 Barun DB에서 검색된 것이라는 것을 표현해주고, 사용자가 Census의 검색 결과를 원하면 다시 검색하게하면 된다.
 */

export type censusSearchResponse = {
  result: { geographies: censusSearchContents }
}

export type censusSearchContents = {
  States?: CensusState[]
  Counties?: CensusCounties[]
  'County Subdivisions'?: CensusCountySubdivisions[]
  'Incorporated Places'?: CensusPlace[]
}

/**
 * @example https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=-73.95&y=40.76&benchmark=4&vintage=4
 */
@Injectable()
export class CensusSearchCoordinatesService {
  private baseUrl = 'https://geocoding.geo.census.gov'
  private path = '/geocoder/geographies/coordinates'

  async search(coordinates: number[]): Promise<CensusResponseDto | null> {
    coordinates[0] = Number(coordinates[0].toFixed(2))
    coordinates[1] = Number(coordinates[1].toFixed(2))
    const query = `?x=${coordinates[0]}&y=${coordinates[1]}&benchmark=4&vintage=4&format=json`
    const searchUrl = `${this.baseUrl}${this.path}${query}`
    const response: censusSearchResponse = await got.get(searchUrl).json()
    const result = response?.result.geographies

    return new CensusResponseDto(result)
  }
}
