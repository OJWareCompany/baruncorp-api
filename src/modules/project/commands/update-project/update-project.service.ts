/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GeographyRepositoryPort } from '../../../geography/database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../../../geography/geography.di-token'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { ProjectEntity } from '../../domain/project.entity'
import { UpdateProjectCommand } from './update-project.command'
import { CensusResponseDto } from '../../infra/census/census.response.dto'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findProjectOrThrow(command.projectId)

    await this.validate(project, command)
    await this.validateProjectNumber(project, command)
    await this.validatePropertyAddress(project, command)

    if (project.getProps().projectPropertyAddress.fullAddress !== command.projectPropertyAddress.fullAddress) {
      const censusResponse = await this.censusSearchCoordinatesService.search(
        command.projectPropertyAddress.coordinates,
      )
      if (!censusResponse.state.geoId) throw new NotFoundException('Wrong coordinates')
      this.generateGeographyAndAhjNotes(censusResponse)

      project.updatePropertyAddress({
        projectPropertyAddress: command.projectPropertyAddress,
        projectAssociatedRegulatory: {
          stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
          countyId: censusResponse?.county?.geoId,
          countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
          placeId: censusResponse?.place?.geoId,
        },
      })
    }

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      updatedBy: command.updatedByUserId,
    })

    await this.projectRepository.update(project)
  }

  private async validate(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    const organization = await this.projectRepository.isExistedOrganizationById(
      projectEntity.getProps().clientOrganizationId,
    )
    if (!organization) {
      throw new OrganizationNotFoundException()
    }
  }

  private async validateProjectNumber(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    if (projectEntity.getProps().projectNumber === command.projectNumber) return

    const isAlreadyExistedProjectNumber = command.projectNumber
      ? await this.projectRepository.isExistedProjectByClientIdAndProjectNumber(
          projectEntity.getProps().clientOrganizationId,
          command.projectNumber,
        )
      : false

    if (command.projectNumber && isAlreadyExistedProjectNumber) {
      throw new ConflictException(`Project number ${command.projectNumber} is Already Existed`, '30002')
    }
  }

  private async validatePropertyAddress(projectEntity: ProjectEntity, command: UpdateProjectCommand) {
    if (projectEntity.getProps().projectPropertyAddress.fullAddress === command.projectPropertyAddress.fullAddress) {
      return
    }

    const isAlreadyExistedPropertyAddress = await this.projectRepository.isExistedByPropertyOwnerAddress(
      projectEntity.getProps().clientOrganizationId,
      command.projectPropertyAddress.fullAddress,
    )

    if (isAlreadyExistedPropertyAddress) {
      throw new ConflictException(
        `Project Property Full Address ${command.projectPropertyAddress.fullAddress} is Already Existed`,
        '30002',
      )
    }
  }

  async generateGeographyAndAhjNotes(censusResponseDto: CensusResponseDto) {
    const { state, county, countySubdivisions, place } = censusResponseDto
    /**
     * State & Notes
     */
    state && (await this.geographyRepository.createState(state))
    state && (await this.geographyRepository.updateStateNote(state))

    /**
     * County & Notes
     */
    county && (await this.geographyRepository.createCounty(county))
    county && (await this.geographyRepository.updateCountyNote(county, state))

    /**
     * County Subdivisions & Note
     */
    countySubdivisions && (await this.geographyRepository.createCountySubdivisions(countySubdivisions))
    countySubdivisions &&
      (await this.geographyRepository.updateCountySubdivisionsNote(countySubdivisions, state, county))

    /**
     * Place & Note
     */
    place && (await this.geographyRepository.createPlace(place))
    place && (await this.geographyRepository.updatePlaceNote(place, state, county, countySubdivisions))
  }
}
