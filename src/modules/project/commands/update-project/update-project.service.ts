/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CensusSearchCoordinatesService } from '../../infra/census/census.search.coordinates.request.dto'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { UpdateProjectCommand } from './update-project.command'
import { CoordinatesNotFoundException } from '../../domain/project.error'
import { ProjectValidatorDomainService } from '../../domain/domain-services/project-validator.domain-service'
import { AhjNoteGeneratorDomainService } from '../../../geography/domain/domain-services/ahj-generator.domain-service'
import { FilesystemDomainService } from '../../../filesystem/domain/domain-service/filesystem.domain-service'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'
import { UTILITY_REPOSITORY } from '@modules/utility/utility.di-token'
import { UtilityRepositoryPort } from '@modules/utility/database/utility.repository.port'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly ahjNoteGeneratorDomainService: AhjNoteGeneratorDomainService,
    private readonly filesystemDomainService: FilesystemDomainService,
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
      await this.ahjNoteGeneratorDomainService.generateOrUpdate(censusResponse)

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

    console.log(`command.utilityId : ${command.utilityId}`)
    console.log(`project.getProps().utilityId : ${project.getProps().utilityId}`)
    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      updatedBy: command.updatedByUserId,
      utilityId: command.utilityId ?? project.getProps().utilityId,
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
