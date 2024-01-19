/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { OnEvent } from '@nestjs/event-emitter'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { OrderedServiceReactivatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-reactivated.domain-event'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

@Injectable()
export class ReopenAssignedTaskWhenOrderedServiceIsReactivedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: AssignedTaskMapper,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @OnEvent(OrderedServiceReactivatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceReactivatedDomainEvent) {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({
      where: { orderedServiceId: event.aggregateId },
    })

    const assignedTaskEntities = assignedTasks.map(this.mapper.toDomain)
    const loop = assignedTaskEntities.map(
      async (assignedTask) => await assignedTask.reset(this.orderModificationValidator),
    )
    await Promise.all(loop)
    await this.assignedTaskRepo.update(assignedTaskEntities)
  }
}
