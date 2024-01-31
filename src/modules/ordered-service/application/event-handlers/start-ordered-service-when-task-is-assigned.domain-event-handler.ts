/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { AssignedTaskAssignedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-assigned.domain-event'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'

export class StartOrderedServiceWhenTaskIsAssignedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskAssignedDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'task' })
  async handle(event: AssignedTaskAssignedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.orderedServiceId)
    orderedService.start()
    await this.orderedServiceRepo.update(orderedService)
  }
}
