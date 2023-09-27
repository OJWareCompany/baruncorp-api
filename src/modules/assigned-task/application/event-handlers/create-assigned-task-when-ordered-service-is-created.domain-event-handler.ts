/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'
import { AssignedTaskEntity } from '../../domain/assigned-task.entity'

@Injectable()
export class CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(OrderedServiceCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceCreatedDomainEvent) {
    const tasks = await this.prismaService.tasks.findMany({ where: { serviceId: event.serviceId } })
    const assignedTaskEntities = tasks.map((task) => {
      return AssignedTaskEntity.create({
        taskId: task.id,
        orderedServiceId: event.aggregateId,
        jobId: event.jobId,
        assigneeId: null,
      })
    })
    await this.assignedTaskRepo.insert(assignedTaskEntities)
  }
}
