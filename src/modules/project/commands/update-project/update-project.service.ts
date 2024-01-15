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

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
    private readonly censusSearchCoordinatesService: CensusSearchCoordinatesService,
    private readonly projectValidatorDomainService: ProjectValidatorDomainService,
    private readonly ahjNoteGeneratorDomainService: AhjNoteGeneratorDomainService,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findOneOrThrow({ id: command.projectId })
    await this.projectValidatorDomainService.validateForUpdate(project, command)

    if (project.projectPropertyAddress.coordinates !== command.projectPropertyAddress.coordinates) {
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

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      updatedBy: command.updatedByUserId,
    })

    await this.projectRepository.update(project)
  }
}
