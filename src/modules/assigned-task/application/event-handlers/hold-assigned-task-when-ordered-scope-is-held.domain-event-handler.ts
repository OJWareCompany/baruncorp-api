/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderedServiceHeldDomainEvent } from '../../../ordered-service/domain/events/ordered-service-held.domain-event'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

@Injectable()
export class HoldAssignedTaskWhenOrderedScopeIsHeldDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceHeldDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceHeldDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({ orderedServiceId: event.aggregateId })

    await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        await assignedTask.hold(this.orderModificationValidator)
      }),
    )

    await this.assignedTaskRepo.update(assignedTasks)
  }
}
