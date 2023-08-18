import got from 'got'
import { CensusResponseDto } from './census.response.dto'

/**
 * TODO: 검색 결과가 없는 상황에서 Mapbox를 이용해 어디까지의 정보를 입력받을 수 있는가?
 * Census 검색 결과가 없을 경우 Barun DB에서 검색 결과를 반환하고
 * UI에 Barun DB에서 검색된 것이라는 것을 표현해주고, 사용자가 Census의 검색 결과를 원하면 다시 검색하게하면 된다.
 */
export class CensusSearchInput {
  readonly street: string
  readonly city: string
  readonly state: string
  readonly zipCode: string

  constructor(create: CensusSearchInput) {
    this.street = create.street
    this.city = create.city
    this.state = create.state
    this.zipCode = create.zipCode
  }
}

export class CensusSearchRequestDto {
  private baseUrl = 'https://geocoding.geo.census.gov'
  private path = '/geocoder/geographies/address'
  private query: string
  private searchUrl: string
  private benchmark: string
  private vintage: string

  constructor({ street, city, state, zipCode }: CensusSearchInput) {
    this.query = `?street=${street}&city=${city}&state=${state}&zip=${zipCode}&benchmark=4&vintage=4&format=json`
    this.searchUrl = `${this.baseUrl}${this.path}${this.query}`
  }

  async getResponse(): Promise<CensusResponseDto> {
    const response = await got.get(this.searchUrl).json()
    const hasAddressMatches = !!response['result']['addressMatches'][0]
    return hasAddressMatches ? new CensusResponseDto(response) : undefined
  }
}
