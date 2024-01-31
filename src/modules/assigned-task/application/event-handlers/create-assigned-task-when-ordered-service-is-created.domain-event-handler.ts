/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
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
      const entity = AssignedTaskEntity.create({
        serviceId: event.serviceId,
        serviceName: event.serviceName,
        projectId: event.projectId,
        jobId: event.jobId,
        organizationId: event.organizationId,
        organizationName: event.organizationName,
        projectPropertyType: event.projectPropertyType,
        mountingType: event.mountingType,
        description: event.description,
        taskId: task.id,
        taskName: task.name,
        orderedServiceId: event.aggregateId,
        isRevision: event.isRevision,
        projectNumber: event.projectNumber,
        projectPropertyOwnerName: event.projectPropertyOwnerName,
        jobName: event.jobName,
        isExpedited: event.isExpedited,
        updatedBy: null,
        editorUserId: event.editorUserId,
      })
      return entity
    })
    await this.assignedTaskRepo.insert(assignedTaskEntities)
  }
}
