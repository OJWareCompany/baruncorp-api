/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../database/integrated-order-modification-history.repository.port'

@Injectable()
export class GenerateCreationHistoryWhenScopeIsOrderedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceCreatedDomainEvent) {
    const user = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
    const orderedScope = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
    await this.orderHistoryRepo.generateCreationHistory(orderedScope, user)
  }
}
