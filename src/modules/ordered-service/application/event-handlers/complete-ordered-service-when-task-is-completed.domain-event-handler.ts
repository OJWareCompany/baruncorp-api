/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { AssignedTaskCompletedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-completed.domain-event'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'

export class CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskCompletedDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'task' })
  async handle(event: AssignedTaskCompletedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.orderedServiceId)
    const assignedTasks = await this.assignedTaskRepo.find({ orderedServiceId: orderedService.id })
    const isCompleted = assignedTasks.every((task) => task.status === AssignedTaskStatusEnum.Completed)
    if (isCompleted) {
      orderedService.validateAndComplete()
      await this.orderedServiceRepo.update(orderedService)
    }
  }
}
