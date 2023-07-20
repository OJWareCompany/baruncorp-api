import got from 'got'
import { CensusResponseDto } from './census.response'

export class CensusSearchInput {
  street: string
  city: string
  state: string
  zipCode: string

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
