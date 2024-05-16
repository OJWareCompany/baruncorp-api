/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { OrderedServiceStatusUpdatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-status-updated.domain-event'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { JobStatusNotUpdatedException } from '../../domain/job.error'
import { DetermineJobStatus } from '../../domain/domain-services/determine-job-status.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'

export class UpdateJobStatusWhenOrderedServiceStatusUpdatedDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly checkCompletionJob: DetermineJobStatus,
  ) {}

  @OnEvent(OrderedServiceStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceStatusUpdatedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    const job = await this.jobRepository.findJobOrThrow(orderedService.jobId)
    console.log('job event handler')
    try {
      await job.determineCurrentStatus(this.checkCompletionJob)
      await this.jobRepository.update(job)
    } catch (error) {
      if (error instanceof JobStatusNotUpdatedException) return
      throw error
    }
  }
}
