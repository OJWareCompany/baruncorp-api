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

  constructor(response: any) {
    const state = response['States']?.[0]
    this.state = plainToInstance(CensusState, state)

    const county = response['Counties']?.[0]
    this.county = plainToInstance(CensusCounties, county)

    const countySubdivisions = response['County Subdivisions']?.[0]
    this.countySubdivisions = plainToInstance(CensusCountySubdivisions, countySubdivisions)

    const place = response['Incorporated Places']?.[0]
    this.place = plainToInstance(CensusPlace, place)
  }
}
