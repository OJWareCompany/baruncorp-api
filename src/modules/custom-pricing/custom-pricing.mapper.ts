import {
  CustomCommercialPricingTiers,
  CustomFixedPricings,
  CustomPricings,
  CustomResidentialPricingTiers,
  CustomResidentialRevisionPricings,
  Prisma,
} from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { CustomPricingResponseDto } from './dtos/custom-pricing.response.dto'
import { CustomPricingEntity } from './domain/custom-pricing.entity'
import { CustomFixedPrice } from './domain/value-objects/custom-fixed-pricing.value-object'
import { CustomResidentialRevisionPricing } from './domain/value-objects/custom-residential-revision-pricing.value-object'
import { CustomResidentialNewServicePricingTier } from './domain/value-objects/custom-residential-new-servier-tier.value-object'
import { CustomCommercialNewServicePricingTier } from './domain/value-objects/custom-commercial-new-service-tier.value-object'

export type CustomPricingModel = {
  customPricings: CustomPricings
  customResidentialPricings: CustomResidentialPricingTiers[]
  customResidentialRevisionPricings: CustomResidentialRevisionPricings | null
  customCommercialPricings: CustomCommercialPricingTiers[]
  customFixedPricings: CustomFixedPricings | null
}

@Injectable()
export class CustomPricingMapper implements Mapper<CustomPricingEntity, CustomPricingModel, CustomPricingResponseDto> {
  toPersistence(entity: CustomPricingEntity): CustomPricingModel {
    const props = entity.getProps()

    const foreignKey = {
      organizationId: props.organizationId,
      organizationName: props.organizationName,
      serviceId: props.serviceId,
      serviceName: props.serviceName,
    }

    const customFixedPricingsRecord: CustomFixedPricings | null = props.fixedPricing
      ? {
          ...foreignKey,
          price: new Prisma.Decimal(props.fixedPricing?.value),
        }
      : null

    const customCommercialPricingTiersRecord: CustomCommercialPricingTiers[] = props.commercialNewServiceTiers.map(
      (tier) => {
        return {
          ...foreignKey,
          startingPoint: new Prisma.Decimal(tier.startingPoint),
          finishingPoint: tier.finishingPoint ? new Prisma.Decimal(tier.finishingPoint) : null,
          price: new Prisma.Decimal(tier.price),
          gmPrice: new Prisma.Decimal(tier.gmPrice),
        }
      },
    )

    const customResidentialPricingTiersRecord: CustomResidentialPricingTiers[] = props.residentialNewServiceTiers.map(
      (tier) => {
        return {
          ...foreignKey,
          startingPoint: Number(tier.startingPoint),
          finishingPoint: tier.finishingPoint ? Number(tier.finishingPoint) : null,
          price: new Prisma.Decimal(tier.price),
          gmPrice: new Prisma.Decimal(tier.gmPrice),
        }
      },
    )

    const customResidentialRevisionPricingsRecord: CustomResidentialRevisionPricings | null =
      props.residentialRevisionPricing
        ? {
            ...foreignKey,
            price: new Prisma.Decimal(props.residentialRevisionPricing.price),
            gmPrice: new Prisma.Decimal(props.residentialRevisionPricing.gmPrice),
          }
        : null

    const customPricingsRecord: CustomPricings = {
      id: props.id,
      ...foreignKey,
      hasResidentialNewServiceTier: !!customResidentialPricingTiersRecord.length,
      hasResidentialRevisionPricing: !!customResidentialRevisionPricingsRecord,
      hasCommercialNewServiceTier: !!customCommercialPricingTiersRecord.length,
      hasFixedPricing: !!customFixedPricingsRecord,
    }

    return {
      customPricings: customPricingsRecord,
      customResidentialPricings: customResidentialPricingTiersRecord,
      customResidentialRevisionPricings: customResidentialRevisionPricingsRecord,
      customCommercialPricings: customCommercialPricingTiersRecord,
      customFixedPricings: customFixedPricingsRecord,
    }
  }

  toDomain(record: CustomPricingModel): CustomPricingEntity {
    const customPricings = record.customPricings
    const customResidentialPricings = record.customResidentialPricings
    const customResidentialRevisionPricings = record.customResidentialRevisionPricings
    const customCommercialPricings = record.customCommercialPricings
    const customFixedPricings = record.customFixedPricings

    const entity = new CustomPricingEntity({
      id: record.customPricings.id,
      props: {
        serviceId: customPricings.serviceId,
        serviceName: customPricings.serviceName,
        organizationId: customPricings.organizationId,
        organizationName: customPricings.organizationName,
        residentialNewServiceTiers: customResidentialPricings.map((tier) => {
          return new CustomResidentialNewServicePricingTier({
            startingPoint: tier.startingPoint,
            finishingPoint: tier.finishingPoint,
            price: Number(tier.price),
            gmPrice: Number(tier.gmPrice),
          })
        }),
        residentialRevisionPricing: customResidentialRevisionPricings
          ? new CustomResidentialRevisionPricing({
              price: Number(customResidentialRevisionPricings.price),
              gmPrice: Number(customResidentialRevisionPricings.gmPrice),
            })
          : null,
        commercialNewServiceTiers: customCommercialPricings.map((tier) => {
          return new CustomCommercialNewServicePricingTier({
            startingPoint: Number(tier.startingPoint),
            finishingPoint: Number(tier.finishingPoint),
            price: Number(tier.price),
            gmPrice: Number(tier.gmPrice),
          })
        }),
        fixedPricing: customFixedPricings ? new CustomFixedPrice({ value: Number(customFixedPricings.price) }) : null,
      },
    })
    return entity
  }

  toResponse(entity: CustomPricingEntity): CustomPricingResponseDto {
    const props = entity.getProps()
    return new CustomPricingResponseDto({
      customPricingId: props.id,
      serviceId: props.serviceId,
      organizationId: props.organizationId,
      customPricingType: entity.getType(),
      residentialNewServiceTiers: props.residentialNewServiceTiers.map((tier) => {
        return {
          startingPoint: tier.startingPoint,
          finishingPoint: tier.finishingPoint,
          price: tier.price,
          gmPrice: tier.price,
        }
      }),
      residentialRevisionPrice: props.residentialRevisionPricing ? props.residentialRevisionPricing.price : null,
      residentialRevisionGmPrice: props.residentialRevisionPricing ? props.residentialRevisionPricing.gmPrice : null,
      commercialNewServiceTiers: props.commercialNewServiceTiers.map((tier) => {
        return {
          startingPoint: tier.startingPoint,
          finishingPoint: tier.finishingPoint,
          price: tier.price,
          gmPrice: tier.price,
        }
      }),
      fixedPrice: props.fixedPricing ? props.fixedPricing.value : null,
    })
  }
}
