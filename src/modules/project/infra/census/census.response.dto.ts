import { plainToInstance } from 'class-transformer'
import { CensusCounties, CensusCountySubdivisions, CensusPlace, CensusState } from './census.type.dto'
import { ApiProperty } from '@nestjs/swagger'
import { censusSearchContents } from './census.search.coordinates.request.dto'

export class CensusResponseDto {
  @ApiProperty()
  state: CensusState

  @ApiProperty()
  county: CensusCounties

  @ApiProperty()
  countySubdivisions: CensusCountySubdivisions | null

  @ApiProperty()
  place: CensusPlace

  constructor(response: censusSearchContents) {
    const state = response.States?.[0]
    this.state = plainToInstance(CensusState, state)

    const county = response.Counties?.[0]
    this.county = plainToInstance(CensusCounties, county)

    const countySubdivisions = response['County Subdivisions']?.[0]
    this.countySubdivisions = plainToInstance(CensusCountySubdivisions, countySubdivisions)

    // const place = response['Incorporated Places']?.[0]

    const copy: any = { ...response }
    let place = null
    for (const key in copy) {
      if (Array.isArray(copy[key])) {
        place = copy[key].find((obj: { hasOwnProperty: (arg0: string) => any }) => obj.hasOwnProperty('PLACECC'))
        if (place) break
      }
    }

    this.place = plainToInstance(CensusPlace, place)
  }
}
