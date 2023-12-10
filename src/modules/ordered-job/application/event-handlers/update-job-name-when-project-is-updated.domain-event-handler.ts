/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ProjectPropertyAddressUpdatedDomainEvent } from '../../../project/domain/events/project-property-address-updated.domain-event'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'

export class UpdateJobNameWhenProjectIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(ProjectPropertyAddressUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: ProjectPropertyAddressUpdatedDomainEvent) {
    const jobs = await this.jobRepository.findManyBy('projectId', event.aggregateId)
    jobs.map((job) => job.updatePropetyAddress(event.projectPropertyAddress.fullAddress))
    await this.jobRepository.update(jobs)
  }
}
