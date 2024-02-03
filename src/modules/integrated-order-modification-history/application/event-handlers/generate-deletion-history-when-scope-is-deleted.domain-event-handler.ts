/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'
import { OrderedServiceDeletedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-deleted.domain-event'

@Injectable()
export class GenerateDeletionHistoryWhenScopeIsDeletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceDeletedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    await this.orderHistoryRepo.generateDeletionHistory(event.jobId, event.aggregateId, 'Scope', event.deletedAt, user)
  }
}
