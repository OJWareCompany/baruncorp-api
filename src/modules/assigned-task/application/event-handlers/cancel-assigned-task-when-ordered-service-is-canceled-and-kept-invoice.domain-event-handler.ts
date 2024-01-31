/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceCanceledAndKeptInvoiceDomainEvent } from '../../../ordered-service/domain/events/ordered-service-canceled-and-ketp-invoice.domain-event'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderedServiceCanceledDomainEvent } from '../../../ordered-service/domain/events/ordered-service-canceled.domain-event'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

@Injectable()
export class CancelAssignedTaskWhenOrderedServiceIsCanceledAndKeptInvoiceDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceCanceledAndKeptInvoiceDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ invokedFrom: 'scope', queryScope: null })
  async handle(event: OrderedServiceCanceledDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({
      orderedServiceId: event.aggregateId,
    })

    await Promise.all(
      assignedTasks.map(async (assignedTask) => {
        await assignedTask.cancel(this.orderModificationValidator)
      }),
    )

    await this.assignedTaskRepo.update(assignedTasks)
  }
}
