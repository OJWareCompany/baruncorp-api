import { Injectable } from '@nestjs/common'
import { OrderedTaskRepositoryPort } from './ordered-task.repository.port'
import { OrderedTaskEntity } from '../domain/ordered-task.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { OrderedTaskMapper } from '../ordered-task.mapper'

@Injectable()
export class OrderedTaskRepository implements OrderedTaskRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly orderedTaskMapper: OrderedTaskMapper) {}
  async insert(entity: OrderedTaskEntity): Promise<void> {
    const record = this.orderedTaskMapper.toPersistence(entity)
    await this.prismaService.orderedTasks.create({ data: { ...record } })
  }
}
