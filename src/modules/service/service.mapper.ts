import { Prisma, Service, Tasks, CommercialStandardPricingTiers } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { ServiceResponseDto } from './dtos/service.response.dto'
import { ServiceEntity } from './domain/service.entity'
import { Pricing } from './domain/value-objects/pricing.value-object'
import { ResidentialStandardPricing } from './domain/value-objects/residential-standard-pricing.value-object'
import { CommercialStandardPricingTier } from './domain/value-objects/commercial-standard-pricing-tier.value-object'
import { CommercialStandardPricing } from './domain/value-objects/commercial-standard-pricing.value-object'
import { CommercialRevisionStandardPricing } from './domain/value-objects/commercial-revision-standard-pricing.value-object'
import { ServicePricingTypeEnum } from './domain/service.type'
import { FixedPrice } from './domain/value-objects/fixed-price.value-object'
import { StandardPricing } from './domain/value-objects/standard-pricing.value-object'

export class ServiceMapper
  implements
    Mapper<
      ServiceEntity,
      {
        service: Service
        commercialStandardPricingTiers: CommercialStandardPricingTiers[]
      },
      ServiceResponseDto
    >
{
  toPersistence(entity: ServiceEntity): {
    service: Service
    commercialStandardPricingTiers: CommercialStandardPricingTiers[]
  } {
    const props = entity.getProps()
    const serviceRecord: Service = {
      id: props.id,
      name: props.name,
      billingCode: props.billingCode,
      basePrice: props.pricing.standard?.residential?.price
        ? new Prisma.Decimal(props.pricing.standard.residential.price.toFixed(4))
        : null,
      gmPrice: props.pricing.standard?.residential?.gmPrice
        ? new Prisma.Decimal(props.pricing.standard.residential.gmPrice.toFixed(4))
        : null,
      revisionPrice: props.pricing.standard?.residential?.revisionPrice
        ? new Prisma.Decimal(props.pricing.standard.residential.revisionPrice.toFixed(4))
        : null,
      revisionGmPrice: props.pricing.standard?.residential?.revisionGmPrice
        ? new Prisma.Decimal(props.pricing.standard.residential.revisionGmPrice.toFixed(4))
        : null,
      fixedPrice: props.pricing.fixedPrice ? new Prisma.Decimal(props.pricing.fixedPrice.toFixed(4)) : null,
      commercialRevisionCostPerUnit: props.pricing.standard?.commercial?.revision.costPerUnit
        ? new Prisma.Decimal(props.pricing.standard.commercial.revision.costPerUnit.toFixed(4))
        : null,
      commercialRevisionMinutesPerUnit: props.pricing.standard?.commercial
        ? props.pricing.standard.commercial.revision.minutesPerUnit
        : null,
      residentialNewEstimatedTaskDuration: props.residentialNewEstimatedTaskDuration
        ? new Prisma.Decimal(props.residentialNewEstimatedTaskDuration.toFixed(4))
        : null,
      residentialRevisionEstimatedTaskDuration: props.residentialRevisionEstimatedTaskDuration
        ? new Prisma.Decimal(props.residentialRevisionEstimatedTaskDuration.toFixed(4))
        : null,
      commercialNewEstimatedTaskDuration: props.commercialNewEstimatedTaskDuration
        ? new Prisma.Decimal(props.commercialNewEstimatedTaskDuration.toFixed(4))
        : null,
      commercialRevisionEstimatedTaskDuration: props.commercialRevisionEstimatedTaskDuration
        ? new Prisma.Decimal(props.commercialRevisionEstimatedTaskDuration.toFixed(4))
        : null,
    }
    const commercialStandardPricingTiersRecord: CommercialStandardPricingTiers[] = props.pricing.standard?.commercial
      ? props.pricing.standard?.commercial?.newServiceTiers.map((tier) => {
          return {
            serviceId: props.id,
            serviceName: props.name,
            startingPoint: new Prisma.Decimal(tier.startingPoint.toFixed(4)),
            finishingPoint: new Prisma.Decimal(tier.finishingPoint.toFixed(4)),
            price: new Prisma.Decimal(tier.price.toFixed(4)),
            gmPrice: new Prisma.Decimal(tier.gmPrice.toFixed(4)),
          }
        })
      : []

    return {
      service: serviceRecord,
      commercialStandardPricingTiers: commercialStandardPricingTiersRecord,
    }
  }

  toDomain(record: {
    service: Service
    commercialStandardPricingTiers: CommercialStandardPricingTiers[]
    tasks: Tasks[]
  }): ServiceEntity {
    // Residential
    const residential = new ResidentialStandardPricing({
      price: record.service.basePrice ? Number(record.service.basePrice) : null,
      gmPrice: record.service.gmPrice ? Number(record.service.gmPrice) : null,
      revisionPrice: record.service.revisionPrice ? Number(record.service.revisionPrice) : null,
      revisionGmPrice: record.service.revisionGmPrice ? Number(record.service.revisionGmPrice) : null,
    })

    // Commercial
    const commercialNewServiceTiers = record.commercialStandardPricingTiers.map((tier) => {
      return new CommercialStandardPricingTier({
        startingPoint: Number(tier.startingPoint),
        finishingPoint: Number(tier.finishingPoint),
        price: Number(tier.price),
        gmPrice: Number(tier.gmPrice),
      })
    })

    const commercialRevision = new CommercialRevisionStandardPricing({
      costPerUnit: record.service.commercialRevisionCostPerUnit
        ? Number(record.service.commercialRevisionCostPerUnit)
        : null,
      minutesPerUnit: record.service.commercialRevisionMinutesPerUnit
        ? Number(record.service.commercialRevisionMinutesPerUnit)
        : null,
    })

    // Fixed
    const fixedPrice = record.service.fixedPrice ? new FixedPrice({ value: Number(record.service.fixedPrice) }) : null

    const entity = new ServiceEntity({
      id: record.service.id,
      props: {
        name: record.service.name,
        billingCode: record.service.billingCode,
        pricing: new Pricing({
          type: fixedPrice ? ServicePricingTypeEnum.fixed : ServicePricingTypeEnum.standard,
          standard: new StandardPricing({
            residential,
            commercial: new CommercialStandardPricing({
              newServiceTiers: commercialNewServiceTiers,
              revision: commercialRevision,
            }),
          }),
          fixed: fixedPrice,
        }),
        tasks: record.tasks,
        residentialNewEstimatedTaskDuration: record.service.residentialNewEstimatedTaskDuration
          ? Number(record.service.residentialNewEstimatedTaskDuration)
          : null,
        residentialRevisionEstimatedTaskDuration: record.service.residentialRevisionEstimatedTaskDuration
          ? Number(record.service.residentialRevisionEstimatedTaskDuration)
          : null,
        commercialNewEstimatedTaskDuration: record.service.commercialNewEstimatedTaskDuration
          ? Number(record.service.commercialNewEstimatedTaskDuration)
          : null,
        commercialRevisionEstimatedTaskDuration: record.service.commercialRevisionEstimatedTaskDuration
          ? Number(record.service.commercialRevisionEstimatedTaskDuration)
          : null,
      },
    })
    return entity
  }

  toResponse(entity: ServiceEntity): ServiceResponseDto {
    const props = entity.getProps()
    const standard = props.pricing.standard
    const response = new ServiceResponseDto({
      id: props.id,
      name: props.name,
      billingCode: props.billingCode,
      pricingType: props.pricing.type,
      standardPricing: standard
        ? {
            residentialPrice: standard.residential ? standard.residential.price : null,
            residentialGmPrice: standard.residential ? standard.residential.gmPrice : null,
            residentialRevisionPrice: standard.residential ? standard.residential.revisionPrice : null,
            residentialRevisionGmPrice: standard.residential ? standard.residential.revisionGmPrice : null,
            commercialRevisionCostPerUnit: standard.commercial ? standard.commercial.revision.costPerUnit : null,
            commercialRevisionMinutesPerUnit: standard.commercial ? standard.commercial.revision.minutesPerUnit : null,
            commercialNewServiceTiers: standard.commercial
              ? standard.commercial.newServiceTiers.map((tier) => tier.unpack())
              : [],
          }
        : null,
      fixedPrice: props.pricing.fixedPrice,
      relatedTasks: props.tasks.map((task) => {
        return {
          id: task.id,
          name: task.name,
        }
      }),
      residentialNewEstimatedTaskDuration: props.residentialNewEstimatedTaskDuration,
      residentialRevisionEstimatedTaskDuration: props.residentialRevisionEstimatedTaskDuration,
      commercialNewEstimatedTaskDuration: props.commercialNewEstimatedTaskDuration,
      commercialRevisionEstimatedTaskDuration: props.commercialRevisionEstimatedTaskDuration,
    })

    return response
  }
}
