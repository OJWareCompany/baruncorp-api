import { Injectable } from '@nestjs/common'
import { Departments } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { DepartmentMapper } from '../department.mapper'
import { Paginated } from '../../../libs/ddd/repository.port'
import { DepartmentRepositoryPort } from './department.repository.port'
import { DepartmentEntity } from '../domain/department.entity'
import { DepartmentNotFoundException } from '../domain/department.error'

@Injectable()
export class DepartmentRepository implements DepartmentRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly departmentMapper: DepartmentMapper) {}
  find(): Promise<Paginated<DepartmentEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: DepartmentEntity): Promise<void> {
    const record = this.departmentMapper.toPersistence(entity)
    await this.prismaService.departments.create({ data: record })
  }

  async update(entity: DepartmentEntity): Promise<void> {
    const record = this.departmentMapper.toPersistence(entity)
    await this.prismaService.departments.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Departments>`DELETE FROM departments WHERE id = ${id}`
  }

  async findOne(id: string): Promise<DepartmentEntity | null> {
    const record = await this.prismaService.departments.findUnique({ where: { id } })
    return record ? this.departmentMapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<DepartmentEntity> {
    const entity = await this.findOne(id)
    if (!entity) throw new DepartmentNotFoundException()
    return entity
  }

  async findOneByName(name: string, excludingId?: string): Promise<DepartmentEntity | null> {
    const record = await this.prismaService.departments.findFirst({
      where: { name, ...(excludingId && { id: { not: excludingId } }) },
    })
    return record ? this.departmentMapper.toDomain(record) : null
  }
}
