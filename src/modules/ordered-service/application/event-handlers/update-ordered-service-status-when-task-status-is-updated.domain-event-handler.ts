/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskStatusUpdatedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-status-updated.domain-event'
import { DetermineOrderedServiceStatus } from '../../domain/domain-services/determine-ordered-service-status.domain-service'
import { OrderedServiceStatusNotUpdatedException } from '../../domain/ordered-service.error'

export class UpdateOrderedServiceStatusWhenTaskStatusUpdatedDomainEventHandler {
  constructor(
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly determineOrderedServiceStatus: DetermineOrderedServiceStatus,
  ) {}
  @OnEvent(AssignedTaskStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'task' })
  async handle(event: AssignedTaskStatusUpdatedDomainEvent) {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(assignedTask.orderedServiceId)

    try {
      await orderedService.determineStatus(this.determineOrderedServiceStatus)
      await this.orderedServiceRepo.update(orderedService)
    } catch (error) {
      if (error instanceof OrderedServiceStatusNotUpdatedException) return
      throw error
    }
  }
}
