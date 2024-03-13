/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { CheckCompletionJob } from '../../domain/domain-services/check-completion-job.domain-service'
import { OrderedServiceCanceledDomainEvent } from '../../../ordered-service/domain/events/ordered-service-canceled.domain-event'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'

export class CompleteJobWhenOrderedServiceIsCanceledDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly checkCompletionJob: CheckCompletionJob,
  ) {}

  @OnEvent(OrderedServiceCanceledDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceCanceledDomainEvent) {
    const orderedScope = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    const job = await this.jobRepository.findJobOrThrow(orderedScope.jobId)
    await job.determineCurrentStatus(this.checkCompletionJob)
    await this.jobRepository.update(job)
  }
}
