import { Injectable } from '@nestjs/common'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { ServiceEntity } from '../domain/service/service.entity'
import { ServiceRepositoryPort } from './service.repository.port'
import { OrderedServiceEntity } from '../domain/ordered-service/ordered-service.entity'
import { ServiceMapper } from '../service.mapper'

@Injectable()
export class ServiceRepository implements ServiceRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly serviceMapper: ServiceMapper) {}

  async insert(entity: ServiceEntity): Promise<void> {
    const record = this.serviceMapper.toPersistence(entity)
    await this.prismaService.service.create({ data: record })
  }

  findOne(id: string): Promise<ServiceEntity> {
    throw new Error('Method not implemented.')
  }

  find(): Promise<Paginated<ServiceEntity>> {
    throw new Error('Method not implemented.')
  }

  order(entity: OrderedServiceEntity): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findOrders(): Promise<Paginated<OrderedServiceEntity>> {
    throw new Error('Method not implemented.')
  }

  findOrderDetail(): Promise<OrderedServiceEntity> {
    throw new Error('Method not implemented.')
  }
}
