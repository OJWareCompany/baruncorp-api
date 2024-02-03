/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceBackToNotStartedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-back-to-not-started.domain-event'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

@Injectable()
export class BackToAssignedTaskWhenOrderedScopeIsBackToNotStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceBackToNotStartedDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'scope', queryScope: 'self' })
  async handle(event: OrderedServiceBackToNotStartedDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({
      orderedServiceId: event.aggregateId,
    })

    await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        await assignedTask.backToNotStarted(event, this.orderModificationValidator)
      }),
    )

    await this.assignedTaskRepo.update(assignedTasks)
  }
}
