import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { TaskMapper } from '../task.mapper'
import { Paginated } from '../../../libs/ddd/repository.port'
import { TaskEntity } from '../domain/task.entity'
import { TaskRepositoryPort } from './task.repository.port'
import { Tasks } from '@prisma/client'

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly taskMapper: TaskMapper) {}

  async insert(entity: TaskEntity): Promise<void> {
    const record = this.taskMapper.toPersistence(entity)
    await this.prismaService.tasks.create({ data: record })
  }

  async update(entity: TaskEntity): Promise<void> {
    const record = this.taskMapper.toPersistence(entity)
    await this.prismaService.tasks.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Tasks>`DELETE FROM tasks WHERE id = ${id}`
  }

  async findOne(id: string): Promise<TaskEntity | null> {
    const record = await this.prismaService.tasks.findUnique({ where: { id } })
    return record ? this.taskMapper.toDomain(record) : null
  }

  find(): Promise<Paginated<TaskEntity>> {
    throw new Error('Method not implemented.')
  }
}
