/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { OrderedServiceStatusUpdatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-status-updated.domain-event'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { JobDueDateNotUpdatedException, JobStatusNotUpdatedException } from '../../domain/job.error'
import { TotalDurationCalculator } from '../../domain/domain-services/total-duration-calculator.domain-service'
import { DetermineJobStatus } from '../../domain/domain-services/determine-job-status.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'

export class UpdateJobStatusWhenOrderedServiceStatusUpdatedDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly totalDurationCalculator: TotalDurationCalculator,
    private readonly checkCompletionJob: DetermineJobStatus,
  ) {}

  @OnEvent(OrderedServiceStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceStatusUpdatedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    const job = await this.jobRepository.findJobOrThrow(orderedService.jobId)

    // TODO: UpdateDueDateWhenScopeIsOrderedDomainEventHandler 중복 로직
    let statusChanged = true
    let dueDateChanged = true

    try {
      await job.determineCurrentStatusOrThrow(this.checkCompletionJob, this.totalDurationCalculator)
    } catch (error) {
      if (error instanceof JobStatusNotUpdatedException) {
        statusChanged = false
      } else {
        throw error
      }
    }

    try {
      await job.updateDueDateOrThrow({ calculator: this.totalDurationCalculator })
    } catch (error) {
      if (error instanceof JobDueDateNotUpdatedException) {
        dueDateChanged = false
      } else {
        throw error
      }
    }

    if (statusChanged || dueDateChanged) {
      await this.jobRepository.update(job)
    }
  }
}
