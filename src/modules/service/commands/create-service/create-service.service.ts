/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Prisma } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import { ServiceEntity } from '../../domain/service.entity'
import { ServiceNameConflictException, ServiceBillingCodeConflictException } from '../../domain/service.error'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { CreateServiceCommand } from './create-service.command'
import { Pricing } from '../../domain/value-objects/pricing.value-object'
import { CommercialStandardPricingTier } from '../../domain/value-objects/commercial-standard-pricing-tier.value-object'
import { CommercialStandardPricing } from '../../domain/value-objects/commercial-standard-pricing.value-object'
import { CommercialRevisionStandardPricing } from '../../domain/value-objects/commercial-revision-standard-pricing.value-object'
import { ResidentialStandardPricing } from '../../domain/value-objects/residential-standard-pricing.value-object'
import { FixedPrice } from '../../domain/value-objects/fixed-price.value-object'
import { StandardPricing } from '../../domain/value-objects/standard-pricing.value-object'
import { ServicePricingTypeEnum } from '../../domain/service.type'

@CommandHandler(CreateServiceCommand)
export class CreateServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
  ) {}
  async execute(command: CreateServiceCommand): Promise<AggregateID> {
    // Residential
    const residential = new ResidentialStandardPricing({
      price: command.residentialPrice,
      gmPrice: command.residentialGmPrice,
      revisionPrice: command.residentialRevisionPrice,
      revisionGmPrice: command.residentialRevisionGmPrice,
    })

    // Commercial
    const commercialNewServiceTiers = command.commercialNewServiceTiers.map((tier) => {
      return new CommercialStandardPricingTier({
        startingPoint: Number(tier.startingPoint),
        finishingPoint: Number(tier.finishingPoint),
        price: Number(tier.price),
      })
    })

    const commercialRevision = new CommercialRevisionStandardPricing({
      costPerUnit: command.commercialRevisionCostPerUnit,
      minutesPerUnit: command.commercialRevisionMinutesPerUnit,
    })

    const service = ServiceEntity.create({
      name: command.name,
      billingCode: command.billingCode,
      pricing: new Pricing({
        type: command.fixedPrice ? ServicePricingTypeEnum.fixed : ServicePricingTypeEnum.standard,
        standard: new StandardPricing({
          residential,
          commercial: new CommercialStandardPricing({
            newServiceTiers: commercialNewServiceTiers,
            revision: commercialRevision,
          }),
        }),
        fixed: command.fixedPrice ? new FixedPrice({ value: command.fixedPrice }) : null,
      }),
    })

    try {
      await this.serviceRepo.insert(service)
      return service.id
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === UNIQUE_CONSTRAINT_FAILED) {
          if (e.meta?.target === 'name') throw new ServiceNameConflictException()
          if (e.meta?.target === 'billing_code') throw new ServiceBillingCodeConflictException()
        }
      }
      throw e
    }
  }
}
