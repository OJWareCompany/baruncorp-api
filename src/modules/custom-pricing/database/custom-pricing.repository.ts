import { Injectable } from '@nestjs/common'
import { CustomPricings } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { CustomPricingMapper } from '../custom-pricing.mapper'
import { CustomPricingRepositoryPort } from './custom-pricing.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { CustomPricingEntity } from '../domain/custom-pricing.entity'
import { CustomPricingNotFoundException } from '../domain/custom-pricing.error'
import { ServiceId } from '../../service/domain/value-objects/service-id.value-object'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class CustomPricingRepository implements CustomPricingRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customPricingMapper: CustomPricingMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  find(): Promise<Paginated<CustomPricingEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: CustomPricingEntity): Promise<void> {
    const record = this.customPricingMapper.toPersistence(entity)

    await this.prismaService.customPricings.create({ data: record.customPricings })

    // custom Fixed Pricings
    if (record.customFixedPricings) {
      await this.prismaService.customFixedPricings.create({ data: record.customFixedPricings })
    }

    // custom Commercial Pricings
    if (record.customCommercialPricings.length) {
      await this.prismaService.customCommercialPricingTiers.createMany({ data: record.customCommercialPricings })
    }

    // custom Residential Pricings
    if (record.customResidentialPricings.length) {
      await this.prismaService.customResidentialPricingTiers.createMany({ data: record.customResidentialPricings })
    }

    // custom Residential Revision Pricings
    if (record.customResidentialRevisionPricings) {
      await this.prismaService.customResidentialRevisionPricings.create({
        data: record.customResidentialRevisionPricings,
      })
    }

    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: CustomPricingEntity): Promise<void> {
    const record = this.customPricingMapper.toPersistence(entity)
    await this.prismaService.customPricings.update({ where: { id: entity.id }, data: record.customPricings })

    const props = entity.getProps()

    // Delete Pricings
    await this.prismaService.customFixedPricings.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customCommercialPricingTiers.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customResidentialPricingTiers.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customResidentialRevisionPricings.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })

    // custom Fixed Pricings
    if (record.customFixedPricings) {
      await this.prismaService.customFixedPricings.create({ data: record.customFixedPricings })
    }

    // custom Commercial Pricings
    if (record.customCommercialPricings.length) {
      await this.prismaService.customCommercialPricingTiers.createMany({ data: record.customCommercialPricings })
    }

    // custom Residential Pricings
    if (record.customResidentialPricings.length) {
      await this.prismaService.customResidentialPricingTiers.createMany({ data: record.customResidentialPricings })
    }

    // custom Residential Revision Pricings
    if (record.customResidentialRevisionPricings) {
      await this.prismaService.customResidentialRevisionPricings.create({
        data: record.customResidentialRevisionPricings,
      })
    }

    await entity.publishEvents(this.eventEmitter)
  }

  async delete(entity: CustomPricingEntity): Promise<void> {
    const record = this.customPricingMapper.toPersistence(entity)
    await this.prismaService.customPricings.update({ where: { id: entity.id }, data: record.customPricings })

    const props = entity.getProps()

    // Delete Pricings
    await this.prismaService.customFixedPricings.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customCommercialPricingTiers.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customResidentialPricingTiers.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })
    await this.prismaService.customResidentialRevisionPricings.deleteMany({
      where: { serviceId: props.serviceId, organizationId: props.organizationId },
    })

    await this.prismaService.$executeRaw<CustomPricings>`DELETE FROM custom_pricings WHERE id = ${entity.id}`
    await entity.publishEvents(this.eventEmitter)
  }

  // 조회가 되더라도 실제로는 없을 수 있음 (예를들어 revision pricing이 null일 수 있음, 그런 경우에는 base revision pricing이 적용되어야한다.)
  async findOne(serviceId: ServiceId, organizationId: string): Promise<CustomPricingEntity | null> {
    const condition = { serviceId: serviceId.value, organizationId }

    const record = await this.prismaService.customPricings.findFirst({ where: { ...condition } })
    if (!record) return null

    const customResidentialPricings = await this.prismaService.customResidentialPricingTiers.findMany({
      where: { organizationId: record.organizationId, serviceId: record.serviceId },
    })

    const customResidentialRevisionPricings = await this.prismaService.customResidentialRevisionPricings.findFirst({
      where: { organizationId: record.organizationId, serviceId: record.serviceId },
    })

    const customCommercialPricings = await this.prismaService.customCommercialPricingTiers.findMany({
      where: { organizationId: record.organizationId, serviceId: record.serviceId },
    })

    const customFixedPricings = await this.prismaService.customFixedPricings.findFirst({
      where: { organizationId: record.organizationId, serviceId: record.serviceId },
    })

    return record
      ? this.customPricingMapper.toDomain({
          customPricings: record,
          customResidentialPricings: customResidentialPricings,
          customResidentialRevisionPricings: customResidentialRevisionPricings,
          customCommercialPricings: customCommercialPricings,
          customFixedPricings: customFixedPricings,
        })
      : null
  }

  // 여기서 매개 변수 순서가 인터페이스와 달라질수 있는것을 방지하려면 VO를 써야한다.
  async findOneOrThrow(serviceId: ServiceId, organizationId: string): Promise<CustomPricingEntity> {
    const entity = await this.findOne(serviceId, organizationId)
    if (!entity) throw new CustomPricingNotFoundException()
    return entity
  }
}
