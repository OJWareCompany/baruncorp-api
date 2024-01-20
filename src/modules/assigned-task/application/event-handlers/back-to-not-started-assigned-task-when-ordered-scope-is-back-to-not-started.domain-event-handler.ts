/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { OrderedServiceBackToNotStartedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-back-to-not-started.domain-event'
import { OrderedServiceStartedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-started.domain-event'

@Injectable()
export class BackToAssignedTaskWhenOrderedScopeIsBackToNotStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceBackToNotStartedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceBackToNotStartedDomainEvent | OrderedServiceStartedDomainEvent) {
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
