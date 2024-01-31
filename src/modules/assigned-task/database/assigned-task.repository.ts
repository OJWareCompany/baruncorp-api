import { Injectable } from '@nestjs/common'
import { AssignedTasks, Prisma } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../database/prisma.service'
import { AssignedTaskMapper } from '../assigned-task.mapper'
import { AssignedTaskRepositoryPort } from './assigned-task.repository.port'
import { AssignedTaskEntity } from '../domain/assigned-task.entity'
import { AssignedTaskNotFoundException } from '../domain/assigned-task.error'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'
import { PaginatedQueryBase } from '../../../libs/ddd/query.base'
import { UserEntity } from '../../users/domain/user.entity'

@Injectable()
export class AssignedTaskRepository implements AssignedTaskRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly assignedTaskMapper: AssignedTaskMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async updateOnlyEditorInfo(entity: AssignedTaskEntity, editor?: UserEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.assignedTaskMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.assignedTasks.update({
          where: { id: record.id },
          data: { updated_by: editor?.userName.fullName || 'System' },
        })
      }),
    )
  }

  /**
   * order modification history 생성하는 서비스에서, 실질적으로 변경된 데이터가 없을시 updated At을 롤백한다.
   */
  async rollbackUpdatedAtAndEditor(entity: AssignedTaskEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.assignedTaskMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.assignedTasks.update({
          where: { id: record.id },
          data: {
            updated_at: record.updated_at,
            updated_by: entity.getProps().updatedBy,
          },
        })
      }),
    )
  }

  async find(whereInput: Prisma.AssignedTasksWhereInput): Promise<AssignedTaskEntity[]> {
    const records = await this.prismaService.assignedTasks.findMany({ where: whereInput })
    return records.map(this.assignedTaskMapper.toDomain)
  }

  async insert(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.assignedTaskMapper.toPersistence)
    await this.prismaService.assignedTasks.createMany({ data: records })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async update(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.assignedTaskMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.assignedTasks.update({
          where: { id: record.id },
          data: { ...record, updated_at: new Date() },
        })
      }),
    )

    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async delete(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.assignedTaskMapper.toPersistence)
    await this.prismaService.assignedTasks.deleteMany({ where: { id: { in: records.map((record) => record.id) } } })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async findOne(id: string): Promise<AssignedTaskEntity | null> {
    const record = await this.prismaService.assignedTasks.findUnique({ where: { id } })
    return record ? this.assignedTaskMapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<AssignedTaskEntity> {
    const record = await this.findOne(id)
    if (!record) throw new AssignedTaskNotFoundException()
    return record
  }

  async findToVendorInvoice(
    organizationId: string,
    serviceMonth: Date,
    query?: PaginatedQueryBase,
  ): Promise<AssignedTaskEntity[]> {
    // cost not null, completed, is vendor, date
    const records = await this.prismaService.assignedTasks.findMany({
      ...(query && { skip: query.offset }),
      ...(query && { take: query.limit }),
      where: {
        assigneeOrganizationId: organizationId,
        status: AssignedTaskStatusEnum.Completed,
        isVendor: true,
        NOT: { cost: null },
        // TODO: 검토필요, createdAt으로 교체?
        startedAt: {
          gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
      },
    })
    return records.map(this.assignedTaskMapper.toDomain)
  }

  async countTasksToVendorInvoice(organizationId: string, serviceMonth: Date): Promise<number> {
    const result = await this.prismaService.assignedTasks.count({
      where: {
        assigneeOrganizationId: organizationId,
        status: AssignedTaskStatusEnum.Completed,
        isVendor: true,
        NOT: { cost: null },
        // TODO: 검토필요, createdAt으로 교체?
        startedAt: {
          gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
      },
    })

    return result
  }
}
