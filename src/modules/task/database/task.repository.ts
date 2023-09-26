import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { TaskMapper } from '../task.mapper'
import { Paginated } from '../../../libs/ddd/repository.port'
import { TaskEntity } from '../domain/task.entity'
import { TaskRepositoryPort } from './task.repository.port'

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly taskMapper: TaskMapper) {}

  async insert(entity: TaskEntity): Promise<void> {
    const record = this.taskMapper.toPersistence(entity)
    await this.prismaService.tasks.create({ data: record })
  }

  update(entity: TaskEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(entity: TaskEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findOne(id: string): Promise<TaskEntity | null> {
    throw new Error('Method not implemented.')
  }
  find(): Promise<Paginated<TaskEntity>> {
    throw new Error('Method not implemented.')
  }
}
