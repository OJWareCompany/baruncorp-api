/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'
import { JobDeletedDomainEvent } from '../../../ordered-job/domain/events/job-deleted.domain-event'

@Injectable()
export class GenerateDeletionHistoryWhenOrderIsDeletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(JobDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobDeletedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    await this.orderHistoryRepo.generateDeletionHistory(event.jobId, event.aggregateId, 'Job', event.deletedAt, user)
  }
}
