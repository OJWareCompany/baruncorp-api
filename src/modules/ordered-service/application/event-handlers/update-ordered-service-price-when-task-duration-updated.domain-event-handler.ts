/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceMapper } from '../../ordered-service.mapper'
import { AssignedTaskDurationUpdatedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-duration-updated.domain-event'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { ServiceNotFoundException } from '../../../service/domain/service.error'

@Injectable()
export class UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly mapper: OrderedServiceMapper,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(AssignedTaskDurationUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskDurationUpdatedDomainEvent) {
    const record = await this.prismaService.orderedServices.findUnique({
      where: { id: event.orderedServiceId },
      include: { assignedTasks: true, job: true },
    })

    if (!record) throw new OrderedServiceNotFoundException()
    if (record.job.projectType !== 'Commercial') return

    const service = await this.prismaService.service.findUnique({ where: { id: record.serviceId } })
    if (!service) throw new ServiceNotFoundException()

    const duration = record.assignedTasks.reduce((pre, cur) => {
      return pre + Number(cur.duration)
    }, 0)

    const entity = this.mapper.toDomain(record)
    entity.setPriceForCommercialRevision(duration, service)
    await this.orderedServiceRepo.update(entity)
  }
}
