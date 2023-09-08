import { Injectable } from '@nestjs/common'
import { OrderedTaskRepositoryPort } from './ordered-task.repository.port'
import { OrderedTaskEntity } from '../domain/ordered-task.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { OrderedTaskMapper } from '../ordered-task.mapper'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class OrderedTaskRepository implements OrderedTaskRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderedTaskMapper: OrderedTaskMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async findAssociatedTasks(entity: OrderedTaskEntity): Promise<OrderedTaskEntity[]> {
    const records = await this.prismaService.orderedTasks.findMany({ where: { jobId: entity.getProps().jobId } })
    return records.map(this.orderedTaskMapper.toDomain)
  }

  async findById(id: string): Promise<OrderedTaskEntity> {
    const record = await this.prismaService.orderedTasks.findUnique({ where: { id } })
    if (!record) return null
    return this.orderedTaskMapper.toDomain(record)
  }

  async update(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedTaskMapper.toPersistence)
    records.map(async (record) => {
      await this.prismaService.orderedTasks.update({
        where: { id: record.id },
        data: record,
      })
    })

    for (const entity of entities) {
      entity.addUpdateEvent()
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async insert(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedTaskMapper.toPersistence)
    await this.prismaService.orderedTasks.createMany({ data: records })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
  }
}
