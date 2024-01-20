/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ProjectRepositoryPort } from '../../database/project.repository.port'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { PROJECT_REPOSITORY } from '../../project.di-token'

@Injectable()
export class UpdateProjectWhenJobIsCreatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepositoryPort,
  ) {}
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const project = await this.projectRepository.findOneOrThrow({ id: event.projectId })
    const totalOfJobs = await this.projectRepository.countTotalOfJobs(event.projectId)

    project
      .setTotalOfJobs(totalOfJobs)
      .setSystemSize(event.systemSize)
      .setMailingFullAddressForWetStamp(event.mailingAddressForWetStamp?.fullAddress || null)
      .setMountingType(event.mountingType)
    await this.projectRepository.update(project)
  }
}
