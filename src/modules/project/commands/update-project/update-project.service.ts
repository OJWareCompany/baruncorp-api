/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProjectCommand } from './update-project.command'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../project.di-token'

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<void> {
    const project = await this.projectRepository.findProject(command.projectId)

    project.update({
      projectPropertyType: command.projectPropertyType,
      projectPropertyOwner: command.projectPropertyOwner,
      projectNumber: command.projectNumber,
      projectPropertyAddress: command.projectPropertyAddress,
      projectAssociatedRegulatory: command.projectAssociatedRegulatory,
      updatedBy: command.updatedByUserId,
    })

    await this.projectRepository.update(project)
  }
}
