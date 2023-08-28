import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { PROJECT_REPOSITORY } from '../../project.di-token'

@Injectable()
export class UpdateProjectWhenJobIsCreatedEventHandler {
  constructor(@Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort) {}
  @OnEvent([JobCreatedDomainEvent.name], { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const project = await this.projectRepository.findProject(event.projectId)
    project
      .increaseJobCount()
      .updateSystemSize(event.systemSize)
      .updateMailingAddressForWetStamp(event.mailingAddressForWetStamp)

    await this.projectRepository.updateProjectWhenJobIsCreated(project)
  }
}
