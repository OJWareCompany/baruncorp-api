/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { CensusResponseDto } from '../../../project/infra/census/census.response.dto'
import { GEOGRAPHY_REPOSITORY } from '../../geography.di-token'
import { GeographyRepositoryPort } from '../../database/geography.repository.port'

@Injectable()
export class AhjNoteGeneratorDomainService {
  constructor(
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepo: GeographyRepositoryPort,
  ) {}

  async generateOrUpdate(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto
    /**
     * State & Notes
     */
    state && (await this.geographyRepo.createState(state))
    state && (await this.geographyRepo.updateStateNote(state))

    /**
     * County & Notes
     */
    county && (await this.geographyRepo.createCounty(county))
    county && (await this.geographyRepo.updateCountyNote(county, state))

    /**
     * County Subdivisions & Note
     */
    countySubdivisions && (await this.geographyRepo.createCountySubdivisions(countySubdivisions))
    countySubdivisions && (await this.geographyRepo.updateCountySubdivisionsNote(countySubdivisions, state, county))

    /**
     * Place & Note
     */
    place && (await this.geographyRepo.createPlace(place))
    place && (await this.geographyRepo.updatePlaceNote(place, state, county, countySubdivisions))
  }
}
