/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'
import { AssignedTaskEntity } from '../../domain/assigned-task.entity'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from '../../../integrated-order-modification-history/integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepositoryPort } from '../../../integrated-order-modification-history/database/integrated-order-modification-history.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'

@Injectable()
export class CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY)
    private readonly orderHistoryRepo: IntegratedOrderModificationHistoryRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(OrderedServiceCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceCreatedDomainEvent) {
    const editor = event.editorUserId ? await this.userRepo.findOneById(event.editorUserId) : null
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

    // GENERATE HISTORY
    const created = await this.assignedTaskRepo.find({ id: { in: assignedTaskEntities.map((task) => task.id) } })
    await Promise.all(
      created.map(async (task) => {
        await this.orderHistoryRepo.generateCreationHistory(task, editor)
      }),
    )
  }
}
