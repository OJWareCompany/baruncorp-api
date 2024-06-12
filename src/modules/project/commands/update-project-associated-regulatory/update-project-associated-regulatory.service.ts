/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'
import { UpdateProjectAssociatedRegulatoryCommand } from './update-project-associated-regulatory.command'

@CommandHandler(UpdateProjectAssociatedRegulatoryCommand)
export class UpdateProjectAssociatedRegulatoryService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(command: UpdateProjectAssociatedRegulatoryCommand): Promise<void> {
    const project = await this.projectRepository.findOneOrThrow({ id: command.projectId })

    project.updateProjectAssociatedRegulatory({
      stateId: command.projectAssociatedRegulatory.stateId,
      countyId: command.projectAssociatedRegulatory.countyId,
      countySubdivisionsId: command.projectAssociatedRegulatory.countySubdivisionsId,
      placeId: command.projectAssociatedRegulatory.placeId,
      ahjId: command.projectAssociatedRegulatory.ahjId,
    })

    await this.projectRepository.update(project)
  }
}
