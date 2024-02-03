/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject, Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'
import { AssignedTaskDeletedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-deleted.domain-event'

@Injectable()
export class GenerateDeletionHistoryWhenTaskIsDeletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskDeletedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    await this.orderHistoryRepo.generateDeletionHistory(event.jobId, event.aggregateId, 'Task', event.deletedAt, user)
  }
}
