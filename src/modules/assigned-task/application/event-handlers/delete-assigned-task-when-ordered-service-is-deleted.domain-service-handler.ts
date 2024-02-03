/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceDeletedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-deleted.domain-event'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

@Injectable()
export class DeleteAssignedTaskWhenOrderedServiceIsDeletedDomainServiceHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceDeletedDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({ orderedServiceId: event.aggregateId })

    await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        await assignedTask.delete(this.orderModificationValidator)
      }),
    )

    await this.assignedTaskRepo.delete(assignedTasks)
  }
}
