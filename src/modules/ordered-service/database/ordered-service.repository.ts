import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceMapper } from '../ordered-service.mapper'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'

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

  findOne(id: string): Promise<OrderedServiceEntity | null> {
    throw new Error('Method not implemented.')
  }
}
