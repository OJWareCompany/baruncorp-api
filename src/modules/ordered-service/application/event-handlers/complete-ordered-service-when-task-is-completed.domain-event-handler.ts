/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { AssignedTaskCompletedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-completed.domain-event'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { OrderedServiceMapper } from '../../ordered-service.mapper'

@Injectable()
export class CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: OrderedServiceMapper,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(AssignedTaskCompletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCompletedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOne(event.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    const relatedTasks = await this.prismaService.assignedTasks.findMany({
      where: { orderedServiceId: orderedService.id },
    })

    const isAllCompleted = relatedTasks.every((task) => task.status === AssignedTaskStatusEnum.Completed)
    if (isAllCompleted) {
      orderedService.complete()
      await this.orderedServiceRepo.update(orderedService)
    }
  }
}
