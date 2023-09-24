import { Injectable } from '@nestjs/common'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { ServiceMapper } from '../service.mapper'
import { ServiceRepositoryPort } from './service.repository.port'
import { ServiceEntity } from '../domain/service.entity'
import { ServiceWithAssociatedTasksDeleteException } from '../domain/service.error'

@Injectable()
export class ServiceRepository implements ServiceRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly serviceMapper: ServiceMapper) {}

  async insert(entity: ServiceEntity): Promise<void> {
    const record = this.serviceMapper.toPersistence(entity)
    await this.prismaService.service.create({ data: record })
  }

  async update(entity: ServiceEntity): Promise<void> {
    const record = this.serviceMapper.toPersistence(entity)
    await this.prismaService.service.update({
      where: {
        id: record.id,
      },
      data: record,
    })
  }

  async delete(entity: ServiceEntity): Promise<void> {
    if (entity.getProps().tasks.length) throw new ServiceWithAssociatedTasksDeleteException()
    await this.prismaService.service.delete({ where: { id: entity.id } })
  }

  async findOne(id: string): Promise<ServiceEntity | null> {
    const record = await this.prismaService.service.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    })
    return record ? this.serviceMapper.toDomain(record) : null
  }

  find(): Promise<Paginated<ServiceEntity>> {
    throw new Error('Method not implemented.')
  }
}
