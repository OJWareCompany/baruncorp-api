import { Injectable, NotFoundException } from '@nestjs/common'
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

  async findByJobId(jobId: string): Promise<OrderedTaskEntity[]> {
    const records = await this.prismaService.orderedTasks.findMany({ where: { jobId } })
    return records.map(this.orderedTaskMapper.toDomain)
  }

  async findById(id: string): Promise<OrderedTaskEntity> {
    const record = await this.prismaService.orderedTasks.findUnique({ where: { id } })
    if (!record) throw new NotFoundException('Not Task found', '40007')
    return this.orderedTaskMapper.toDomain(record)
  }

  async update(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.orderedTaskMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedTasks.update({
          where: { id: record.id },
          data: record,
        })
      }),
    )

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
