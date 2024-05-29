/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderedServiceStartedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-started.domain-event'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

@Injectable()
export class StartAssignedTaskWhenOrderedScopeIsStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
  ) {}

  @OnEvent(OrderedServiceStartedDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'scope', queryScope: 'self' }) // self 표현이 적절하지 않은것같다.
  async handle(event: OrderedServiceStartedDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({
      orderedServiceId: event.aggregateId,
    })

    assignedTasks.map((assignedTask) => assignedTask.start())

    await this.assignedTaskRepo.update(assignedTasks)
  }
}
