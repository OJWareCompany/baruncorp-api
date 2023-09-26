import { Injectable } from '@nestjs/common'
import { AssignedTasks } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { AssignedTaskMapper } from '../assigned-task.mapper'
import { AssignedTaskRepositoryPort } from './assigned-task.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { AssignedTaskEntity } from '../domain/assigned-task.entity'

@Injectable()
export class AssignedTaskRepository implements AssignedTaskRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly assignedTaskMapper: AssignedTaskMapper) {}

  find(): Promise<Paginated<AssignedTaskEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: AssignedTaskEntity): Promise<void> {
    const record = this.assignedTaskMapper.toPersistence(entity)
    await this.prismaService.assignedTasks.create({ data: record })
  }

  async update(entity: AssignedTaskEntity): Promise<void> {
    const record = this.assignedTaskMapper.toPersistence(entity)
    await this.prismaService.assignedTasks.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<AssignedTasks>`DELETE FROM assigned_task WHERE id = ${id}`
  }

  async findOne(id: string): Promise<AssignedTaskEntity | null> {
    const record = await this.prismaService.assignedTasks.findUnique({ where: { id } })
    return record ? this.assignedTaskMapper.toDomain(record) : null
  }
}
