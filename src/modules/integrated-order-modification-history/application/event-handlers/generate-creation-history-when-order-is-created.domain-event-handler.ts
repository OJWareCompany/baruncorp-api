/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'

@Injectable()
export class GenerateCreationHistoryWhenOrderIsCreatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    const job = await this.jobRepo.findJobOrThrow(event.aggregateId)
    await this.orderHistoryRepo.generateCreationHistory(job, user)
  }
}
