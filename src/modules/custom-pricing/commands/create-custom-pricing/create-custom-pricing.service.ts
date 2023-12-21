/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing.di-token'
import { CustomPricingEntity } from '../../domain/custom-pricing.entity'
import { CreateCustomPricingCommand, ResidentialNewServicePricingTypeEnum } from './create-custom-pricing.command'
import { CustomPricingRepositoryPort } from '../../database/custom-pricing.repository.port'
import { CustomResidentialNewServicePricingTier } from '../../domain/value-objects/custom-residential-new-servier-tier.value-object'
import { CustomResidentialRevisionPricing } from '../../domain/value-objects/custom-residential-revision-pricing.value-object'
import { CustomCommercialNewServicePricingTier } from '../../domain/value-objects/custom-commercial-new-service-tier.value-object'
import { CustomFixedPrice } from '../../domain/value-objects/custom-fixed-pricing.value-object'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { CustomPricingConflictException } from '../../domain/custom-pricing.error'

@CommandHandler(CreateCustomPricingCommand)
export class CreateCustomPricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateCustomPricingCommand): Promise<AggregateID> {
    const customPricing = await this.prismaService.customPricings.findFirst({
      where: { serviceId: command.serviceId, organizationId: command.organizationId },
    })
    if (customPricing) throw new CustomPricingConflictException()
    const organization = await this.prismaService.organizations.findUnique({ where: { id: command.organizationId } })
    if (!organization) throw new OrganizationNotFoundException()

    const service = await this.prismaService.service.findUnique({ where: { id: command.serviceId } })
    if (!service) throw new ServiceNotFoundException()

    const residentialNewServiceTiers = command.residentialNewServiceTiers.map(
      (tier) => new CustomResidentialNewServicePricingTier(tier),
    )

    const residentialRevisionPricing =
      command.residentialRevisionPrice && command.residentialRevisionGmPrice
        ? new CustomResidentialRevisionPricing({
            price: command.residentialRevisionPrice,
            gmPrice: command.residentialRevisionGmPrice,
          })
        : null

    const commercialNewServiceTiers = command.commercialNewServiceTiers.map(
      (tier) => new CustomCommercialNewServicePricingTier(tier),
    )

    const entity = CustomPricingEntity.create({
      serviceId: command.serviceId,
      serviceName: service.name,
      organizationId: command.organizationId,
      organizationName: organization.name,
      residentialNewServiceTiers,
      residentialRevisionPricing,
      commercialNewServiceTiers,
      fixedPricing: command.fixedPrice ? new CustomFixedPrice({ value: command.fixedPrice }) : null,
    })

    // TODO: Refactor (위의 중복 로직 제거)
    if (command.residentialNewServicePricingType === ResidentialNewServicePricingTypeEnum.flat) {
      entity.setResidentialNewServiceFlatPrice(
        Number(command.residentialNewServiceFlatPrice),
        Number(command.residentialNewServiceFlatGmPrice),
      )
    } else if (command.residentialNewServicePricingType === ResidentialNewServicePricingTypeEnum.tier) {
      entity.setResidentialNewServiceTiers(command.residentialNewServiceTiers)
    } else {
      entity.cleanResidentialNewServiceTiers()
    }

    await this.customPricingRepo.insert(entity)

    return entity.id
  }
}
