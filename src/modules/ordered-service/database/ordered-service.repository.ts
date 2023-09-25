import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceMapper } from '../ordered-service.mapper'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'
import { OrderedServiceNotFoundException } from '../domain/ordered-service.error'

@Injectable()
export class OrderedServiceRepository implements OrderedServiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderedServiceMapper: OrderedServiceMapper,
  ) {}
  async insert(entity: OrderedServiceEntity): Promise<void> {
    const record = this.orderedServiceMapper.toPersistence(entity)
    await this.prismaService.orderedServices.create({ data: record })
  }

  async findOne(id: string): Promise<OrderedServiceEntity | null> {
    const record = await this.prismaService.orderedServices.findUnique({
      where: { id },
      include: { assignedTasks: true },
    })
    if (!record) throw new OrderedServiceNotFoundException()
    return this.orderedServiceMapper.toDomain(record)
  }

  async update(entity: OrderedServiceEntity): Promise<void> {
    const record = this.orderedServiceMapper.toPersistence(entity)
    await this.prismaService.orderedServices.update({ where: { id: record.id }, data: record })
  }
}
