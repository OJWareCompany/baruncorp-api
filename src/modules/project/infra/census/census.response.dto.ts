import { plainToInstance } from 'class-transformer'
import { CensusCounties, CensusCountySubdivisions, CensusPlace, CensusState } from './census.type.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CensusResponseDto {
  @ApiProperty()
  state: CensusState

  @ApiProperty()
  county: CensusCounties

  @ApiProperty()
  countySubdivisions: CensusCountySubdivisions | null

  @ApiProperty()
  place: CensusPlace

  @ApiProperty()
  address: string

  @ApiProperty()
  zip: string

  constructor(response: any) {
    const state = response.result.addressMatches[0].geographies['States'][0]
    this.state = plainToInstance(CensusState, state)

    const county = response.result.addressMatches[0].geographies['Counties'][0]
    this.county = plainToInstance(CensusCounties, county)

    const countySubdivisions = response.result.addressMatches[0].geographies['County Subdivisions'][0]
    this.countySubdivisions = plainToInstance(CensusCountySubdivisions, countySubdivisions)

    const place = response.result.addressMatches[0].geographies['Incorporated Places'][0]
    this.place = plainToInstance(CensusPlace, place)

    this.address = response.result.input.address.street
    this.zip = response.result.input.address.zip
  }
}
