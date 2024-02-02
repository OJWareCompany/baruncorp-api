/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { GeographyRepositoryPort } from '../../../geography/database/geography.repository.port'
import { GEOGRAPHY_REPOSITORY } from '../../../geography/geography.di-token'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { UpdateProjectCommand } from './update-project.command'
import { CoordinatesNotFoundException } from '../../domain/project.error'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { FilesystemApiService } from '../../../filesystem/infra/filesystem.api.service'
import { PrismaService } from '../../../database/prisma.service'
import { GenerateCensusResourceDomainService } from '../../../geography/domain/domain-services/generate-census-resource.domain-service'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(GEOGRAPHY_REPOSITORY) private readonly geographyRepository: GeographyRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly filesystemApiService: FilesystemApiService,
    private readonly filesystemDomainService: FilesystemDomainService,
    private readonly prismaService: PrismaService,
    private readonly generateCensusResourceDomainService: GenerateCensusResourceDomainService,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findOneOrThrow({ id: command.projectId })
    await this.projectValidatorDomainService.validateForUpdate(project, command)

    /**
     * @FilesystemLogic
     */
    const fromProjectFolderName = project.projectPropertyAddress.fullAddress
    const fromProjectPropertyType = project.projectPropertyType as ProjectPropertyTypeEnum

    if (!project.deepEqualsPropertyAddressCoordinates(command.projectPropertyAddress.coordinates)) {
      const censusResponse = await this.censusSearchCoordinatesService.search(
        command.projectPropertyAddress.coordinates,
      )
      if (!censusResponse.state.geoId) throw new CoordinatesNotFoundException()

      /**
       * @FilesystemLogic
       */
      await this.generateCensusResourceDomainService.generateGeographyAndAhjNotes(censusResponse)

      project.updatePropertyAddress({
        projectPropertyAddress: command.projectPropertyAddress,
        projectAssociatedRegulatory: {
          stateId: censusResponse.state.geoId, // 무조건 결과값 받아온다고 가정
          countyId: censusResponse?.county?.geoId || null,
          countySubdivisionsId: censusResponse?.countySubdivisions?.geoId || null,
          placeId: censusResponse?.place?.geoId || null,
        },
      })
    }

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      updatedBy: command.updatedByUserId,
    })

    /**
     * @FilesystemLogic
     */
    const toProjectFolderName = command.projectPropertyAddress.fullAddress
    const toProjectPropertyType = command.projectPropertyType as ProjectPropertyTypeEnum
    const needUpdateProjectName = toProjectFolderName !== fromProjectFolderName
    const needUpdateProjectPropertyType = toProjectPropertyType !== fromProjectPropertyType
    const { rollback } = await this.filesystemDomainService.updateGoogleProjectFolders({
      organizationId: project.clientOrganizationId,
      projectId: project.id,
      toProjectFolderName,
      toProjectPropertyType,
      needUpdateProjectName,
      needUpdateProjectPropertyType,
    })

    try {
      await this.projectRepository.update(project)
    } catch (error) {
      /**
       * @FilesystemLogic
       */
      rollback && (await rollback())
      throw error
    }
  }
}
