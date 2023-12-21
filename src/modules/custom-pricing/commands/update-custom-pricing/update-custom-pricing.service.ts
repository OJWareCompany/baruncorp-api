/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CustomPricingRepositoryPort } from '../../database/custom-pricing.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing.di-token'
import { UpdateCustomPricingCommand } from './update-custom-pricing.command'
import { ResidentialNewServicePricingTypeEnum } from '../create-custom-pricing/create-custom-pricing.command'

@CommandHandler(UpdateCustomPricingCommand)
export class UpdateCustomPricingService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
  ) {}
  async execute(command: UpdateCustomPricingCommand): Promise<void> {
    const entity = await this.customPricingRepo.findOneOrThrow(command.organizationId, command.serviceId)
    const residentialRevisionPricing =
      command.residentialRevisionPrice && command.residentialRevisionGmPrice
        ? {
            price: command.residentialRevisionPrice,
            gmPrice: command.residentialRevisionGmPrice,
          }
        : null

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

    entity.setResidentialRevisionPricing(residentialRevisionPricing)
    entity.setCommercialNewServiceTiers(command.commercialNewServiceTiers)
    entity.setFixedPrice(command.fixedPrice)
    await this.customPricingRepo.update(entity)
  }
}
