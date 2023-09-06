/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { AddressFromMapBox } from '../../infra/census/census.type.dto'
import { CensusResponseDto } from '../../infra/census/census.response.dto'
import { GeographyRepositoryPort } from '../../../geography/database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../../../geography/geography.di-token'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'

@Injectable()
export class CreateAhjNoteService {
  // prisma Service같은 공통적으로 쓰일수 있는 모듈은 어떻게 관리하는가?
  constructor(
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
  ) {}

  async searchCensusAndCreateNote(createProjectDto: AddressFromMapBox) {
    const { coordinates } = createProjectDto
    const censusResponse = await this.censusSearchCoordinatesService.search(coordinates)
    await this.generateGeographyAndAhjNotes(censusResponse)
  }

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto

    /**
     * State & Notes
     */
    await this.geographyRepository.createState(state)
    await this.geographyRepository.updateStateNote(state)

    /**
     * County & Notes
     */
    await this.geographyRepository.createCounty(county)
    await this.geographyRepository.updateCountyNote(county, state)

    /**
     * County Subdivisions & Note
     */
    await this.geographyRepository.createCountySubdivisions(countySubdivisions)
    await this.geographyRepository.updateCountySubdivisionsNote(countySubdivisions, state, county)

    /**
     * Place & Note
     */
    await this.geographyRepository.createPlace(place)
    await this.geographyRepository.updatePlaceNote(place, state, county, countySubdivisions)
  }
}