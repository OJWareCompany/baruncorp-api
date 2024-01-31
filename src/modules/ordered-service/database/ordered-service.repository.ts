import { OrderedServices } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import _ from 'lodash'
import { AssignedTaskStatusEnum } from '../../assigned-task/domain/assigned-task.type'
import { PrismaService } from '../../database/prisma.service'
import { UserEntity } from '../../users/domain/user.entity'
import { OrderedServiceNotFoundException } from '../domain/ordered-service.error'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceMapper } from '../ordered-service.mapper'

@Injectable()
export class OrderedServiceRepository implements OrderedServiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderedServiceMapper: OrderedServiceMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async updateOnlyEditorInfo(entity: OrderedServiceEntity, editor?: UserEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedServiceMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedServices.update({
          where: { id: record.id },
          data: { updated_by: editor?.userName.fullName || 'System' },
        })
      }),
    )
  }

  /**
   * order modification history 생성하는 서비스에서, 실질적으로 변경된 데이터가 없을시 updated At을 롤백한다.
   */
  async rollbackUpdatedAtAndEditor(entity: OrderedServiceEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedServiceMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedServices.update({
          where: { id: record.id },
          data: {
            updated_at: record.updated_at,
            updated_by: entity.getProps().updatedBy,
          },
        })
      }),
    )
  }

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

  async find(ids: string[]): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: { id: { in: ids } },
      include: { assignedTasks: true },
    })
    return _.isEmpty(records) ? [] : records.map(this.orderedServiceMapper.toDomain)
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
        await this.prismaService.orderedServices.update({
          where: { id: record.id },
          data: { ...record, updated_at: new Date() },
        })
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
