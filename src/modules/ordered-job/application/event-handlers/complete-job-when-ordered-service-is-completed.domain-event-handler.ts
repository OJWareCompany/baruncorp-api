/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { OrderedServiceCompletedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-completed.domain-event'
import { CheckCompletionJob } from '../../domain/domain-services/check-completion-job.domain-service'

export class CompleteJobWhenOrderedServiceIsCompletedDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly checkCompletionJob: CheckCompletionJob,
  ) {}

  @OnEvent(OrderedServiceCompletedDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceCompletedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    await job.determineCurrentStatus(this.checkCompletionJob)
    await this.jobRepository.update(job)
  }
}
