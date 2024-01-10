import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ServiceMapper } from '../service.mapper'
import { ServiceRepositoryPort } from './service.repository.port'
import { ServiceEntity } from '../domain/service.entity'
import { ServiceNotFoundException, ServiceWithAssociatedTasksDeleteException } from '../domain/service.error'
import { Prisma } from '@prisma/client'

@Injectable()
export class ServiceRepository implements ServiceRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly serviceMapper: ServiceMapper) {}

  // TODO: Tier 각 요소 검증하기
  async insert(entity: ServiceEntity): Promise<void> {
    const record = this.serviceMapper.toPersistence(entity)
    await this.prismaService.service.create({ data: record.service })
    await this.prismaService.commercialStandardPricingTiers.createMany({ data: record.commercialStandardPricingTiers })
  }

  async update(entity: ServiceEntity): Promise<void> {
    const record = this.serviceMapper.toPersistence(entity)
    await this.prismaService.service.update({
      where: {
        id: record.service.id,
      },
      data: record.service,
    })
    await this.prismaService.commercialStandardPricingTiers.deleteMany({ where: { serviceId: entity.id } })
    await this.prismaService.commercialStandardPricingTiers.createMany({ data: record.commercialStandardPricingTiers })
  }

  async delete(entity: ServiceEntity): Promise<void> {
    if (entity.getProps().tasks.length) throw new ServiceWithAssociatedTasksDeleteException()
    await this.prismaService.commercialStandardPricingTiers.deleteMany({ where: { serviceId: entity.id } })
    await this.prismaService.service.delete({ where: { id: entity.id } })
  }

  async findOne(id: string): Promise<ServiceEntity | null> {
    const record = await this.prismaService.service.findUnique({
      where: { id },
      include: {
        tasks: true,
        commercialStandardPricingTiers: true,
      },
    })
    return record
      ? this.serviceMapper.toDomain({
          service: record,
          commercialStandardPricingTiers: record.commercialStandardPricingTiers,
          tasks: record.tasks,
        })
      : null
  }

  async findOneOrThrow(id: string): Promise<ServiceEntity> {
    const entity = await this.findOne(id)
    if (!entity) throw new ServiceNotFoundException()
    return entity
  }

  async find(whereInput: Prisma.ServiceWhereInput): Promise<ServiceEntity[]> {
    const records = await this.prismaService.service.findMany({
      where: whereInput,
      include: {
        tasks: true,
        commercialStandardPricingTiers: true,
      },
    })
    return records.map((record) => {
      return this.serviceMapper.toDomain({
        service: record,
        commercialStandardPricingTiers: record.commercialStandardPricingTiers,
        tasks: record.tasks,
      })
    })
  }
}
