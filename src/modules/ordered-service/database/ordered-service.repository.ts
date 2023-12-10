import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceMapper } from '../ordered-service.mapper'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'
import { OrderedServiceNotFoundException } from '../domain/ordered-service.error'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { OrderedServices } from '@prisma/client'
import { AssignedTaskStatusEnum } from '../../assigned-task/domain/assigned-task.type'

@Injectable()
export class OrderedServiceRepository implements OrderedServiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderedServiceMapper: OrderedServiceMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async insert(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedServiceMapper.toPersistence)
    await this.prismaService.orderedServices.createMany({ data: records })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async findOne(id: string): Promise<OrderedServiceEntity | null> {
    const record = await this.prismaService.orderedServices.findUnique({
      where: { id },
      include: { assignedTasks: true },
    })
    return record ? this.orderedServiceMapper.toDomain(record) : null
  }

  async find(ids: string[]): Promise<OrderedServiceEntity[] | null> {
    const records = await this.prismaService.orderedServices.findMany({
      where: { id: { in: ids } },
      include: { assignedTasks: true },
    })
    return records.map(this.orderedServiceMapper.toDomain)
  }

  async findOneOrThrow(id: string): Promise<OrderedServiceEntity> {
    const entity = await this.findOne(id)
    if (!entity) throw new OrderedServiceNotFoundException()
    return entity
  }

  async findBy(
    propertyName: keyof OrderedServices,
    values: OrderedServices[typeof propertyName][],
  ): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: { [propertyName]: { in: values } },
      include: { assignedTasks: true },
    })
    return records.map(this.orderedServiceMapper.toDomain)
  }

  async update(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedServiceMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedServices.update({ where: { id: record.id }, data: record })
      }),
    )

    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.orderedServices.delete({ where: { id } })
  }

  async getPreviouslyOrderedServices(projectId: string, serviceId: string): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: {
        projectId: projectId,
        serviceId: serviceId,
        // id: { not: orderedServiceId },
        status: { notIn: [AssignedTaskStatusEnum.Canceled, AssignedTaskStatusEnum.On_Hold] },
      },
      include: { assignedTasks: true },
    })

    return records.map(this.orderedServiceMapper.toDomain)
  }
}
