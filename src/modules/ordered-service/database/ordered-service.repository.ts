import { EventEmitter2 } from '@nestjs/event-emitter'
import { endOfMonth, startOfMonth } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import _ from 'lodash'
import { PrismaService } from '../../database/prisma.service'
import { UserEntity } from '../../users/domain/user.entity'
import { OrderedServiceNotFoundException } from '../domain/ordered-service.error'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'
import { OrderedServiceStatusEnum } from '../domain/ordered-service.type'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceMapper } from '../ordered-service.mapper'
import { ValidScopeStatus } from '../domain/value-objects/valid-previously-scope-status.value-object'

@Injectable()
export class OrderedServiceRepository implements OrderedServiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderedServiceMapper: OrderedServiceMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async findPreviousSameScopesCompletedInOrderedMonth(
    clientOrganizationId: string,
    scopeId: string,
    orderedAt: Date,
    status: OrderedServiceStatusEnum.Completed,
  ): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: {
        organizationId: clientOrganizationId,
        serviceId: scopeId,
        status,
        orderedAt: {
          gte: zonedTimeToUtc(startOfMonth(orderedAt), 'Etc/UTC'),
          lt: zonedTimeToUtc(endOfMonth(orderedAt), 'Etc/UTC'),
        },
      },
      include: { assignedTasks: true },
    })
    return records.map(this.orderedServiceMapper.toDomain)
  }

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

  async findBy(whereInput: Prisma.OrderedServicesWhereInput): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: whereInput,
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

  async delete(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    // 하위 엔티티를 먼저 제거해야 제거가 된다.
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
    const records = entities.map(this.orderedServiceMapper.toPersistence)
    await this.prismaService.orderedServices.deleteMany({ where: { id: { in: records.map((record) => record.id) } } })
  }

  async findPreviousSameScopesInProject(
    projectId: string,
    scopeId: string,
    orderedAt: Date,
    status: ValidScopeStatus,
  ): Promise<OrderedServiceEntity[]> {
    const records = await this.prismaService.orderedServices.findMany({
      where: {
        projectId: projectId,
        serviceId: scopeId,
        status: { in: status.value },
        orderedAt: { lt: orderedAt },
      },
      include: { assignedTasks: true },
    })

    return records.map(this.orderedServiceMapper.toDomain)
  }
}
