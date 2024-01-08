/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceCanceledDomainEvent } from '../../../ordered-service/domain/events/ordered-service-canceled.domain-event'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { TaskStatusChangeValidationDomainService } from '../../domain/domain-services/task-status-change-validation.domain-service'

@Injectable()
export class CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: AssignedTaskMapper,
    private readonly taskStatusValidator: TaskStatusChangeValidationDomainService,
  ) {}

  @OnEvent(OrderedServiceCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceCanceledDomainEvent) {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({
      where: { orderedServiceId: event.aggregateId },
    })

    const assignedTaskEntities = assignedTasks.map(this.mapper.toDomain)
    assignedTaskEntities.map(async (assignedTask) => await assignedTask.cancel(this.taskStatusValidator))
    await Promise.all(assignedTaskEntities)
    await this.assignedTaskRepo.update(assignedTaskEntities)
  }
}
