/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { ServiceRepositoryPort } from '../../database/service.repository.port'
import {
  ServiceNotFoundException,
  ServiceNameConflictException,
  ServiceBillingCodeConflictException,
} from '../../domain/service.error'
import { SERVICE_REPOSITORY } from '../../service.di-token'
import { UpdateServiceCommand } from './update-service.command'
import { CommercialRevisionStandardPricing } from '../../domain/value-objects/commercial-revision-standard-pricing.value-object'
import { CommercialStandardPricingTier } from '../../domain/value-objects/commercial-standard-pricing-tier.value-object'
import { ResidentialStandardPricing } from '../../domain/value-objects/residential-standard-pricing.value-object'
import { Pricing } from '../../domain/value-objects/pricing.value-object'
import { CommercialStandardPricing } from '../../domain/value-objects/commercial-standard-pricing.value-object'
import { FixedPrice } from '../../domain/value-objects/fixed-price.value-object'
import { StandardPricing } from '../../domain/value-objects/standard-pricing.value-object'

@CommandHandler(UpdateServiceCommand)
export class UpdateServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
  ) {}
  async execute(command: UpdateServiceCommand): Promise<void> {
    const service = await this.serviceRepo.findOne(command.serviceId)
    if (!service) throw new ServiceNotFoundException()
    service.updateName(command.name)
    service.updateBillingCode(command.billingCode)
    service.updateTaskDuration({
      residentialNewEstimatedTaskDuration: command.residentialNewEstimatedTaskDuration,
      residentialRevisionEstimatedTaskDuration: command.residentialRevisionEstimatedTaskDuration,
      commercialNewEstimatedTaskDuration: command.commercialNewEstimatedTaskDuration,
      commercialRevisionEstimatedTaskDuration: command.commercialRevisionEstimatedTaskDuration,
    })

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
        gmPrice: Number(tier.gmPrice),
      })
    })

    const commercialRevision = new CommercialRevisionStandardPricing({
      costPerUnit: command.commercialRevisionCostPerUnit,
      minutesPerUnit: command.commercialRevisionMinutesPerUnit,
    })

    service.updatePricing(
      new Pricing({
        type: command.type,
        standard: new StandardPricing({
          residential,
          commercial: new CommercialStandardPricing({
            newServiceTiers: commercialNewServiceTiers,
            revision: commercialRevision,
          }),
        }),
        fixed: command.fixedPrice ? new FixedPrice({ value: command.fixedPrice }) : null,
      }),
    )

    try {
      await this.serviceRepo.update(service)
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
