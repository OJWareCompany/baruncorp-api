import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { AddressFromMapBox } from './infra/census/census.type.dto'
import { CensusResponseDto } from './infra/census/census.response.dto'
import { GeographyRepositoryPort } from '../geography/database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../geography/geography.di-token'
import { CensusSearchInput, CensusSearchRequestDto } from './infra/census/census.search.request.dto'

@Injectable()
export class ProjectService {
  // prisma Service같은 공통적으로 쓰일수 있는 모듈은 어떻게 관리하는가?
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
  ) {}

  async createProject(createProjectDto: AddressFromMapBox) {
    const { state, postalCode, city, street1, street2 } = createProjectDto

    const searchInput = new CensusSearchInput({
      street: `${street1 || 'none'} ${street2}`,
      city,
      state,
      zipCode: postalCode,
    })
    const censusSearch = new CensusSearchRequestDto(searchInput)
    const censusResponse = await censusSearch.getResponse()

    await this.generateGeographyAndAhjNotes(censusResponse)
  }

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place, address, zip } = censusResponseDto

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
