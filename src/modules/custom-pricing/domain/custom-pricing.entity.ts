import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateCustomPricingProps, CustomPricingProps } from './custom-pricing.type'
import { CustomFixedPrice } from './value-objects/custom-fixed-pricing.value-object'
import { CustomCommercialNewServicePricingTier } from './value-objects/custom-commercial-new-service-tier.value-object'
import { Pricing } from '../../service/domain/value-objects/pricing.value-object'
import { CustomResidentialRevisionPricing } from './value-objects/custom-residential-revision-pricing.value-object'
import { CustomResidentialNewServicePricingTier } from './value-objects/custom-residential-new-servier-tier.value-object'
import { CustomPricingType } from '../commands/create-custom-pricing/create-custom-pricing.command'
import { MountingType, ProjectPropertyType } from '../../project/domain/project.type'
import { OrderedServiceSizeForRevision } from '../../ordered-service/domain/ordered-service.type'

export class CustomPricingEntity extends AggregateRoot<CustomPricingProps> {
  protected _id: string

  static create(create: CreateCustomPricingProps) {
    const id = v4()
    const props: CustomPricingProps = {
      ...create,
    }
    return new CustomPricingEntity({ id, props })
  }

  getType(): CustomPricingType {
    return this.props.fixedPricing ? CustomPricingType.custom_fixed : CustomPricingType.custom_standard
  }

  // residentialNewServiceTiers: CustomResidentialNewServicePricingTier[]
  // residentialRevisionPricing: CustomResidentialRevisionPricing | null
  // commercialNewServiceTiers: CustomCommercialNewServicePricingTier[]
  // fixedPricing: CustomFixedPrice | null
  hasNewResidentialPricing() {
    return !!this.props.residentialNewServiceTiers.length
  }

  hasRevisionResidentialPricing() {
    return !!this.props.residentialRevisionPricing
  }

  hasNewCommercialPricing() {
    return !!this.props.commercialNewServiceTiers.length
  }

  hasFixedPricing() {
    return !!this.props.fixedPricing
  }

  setResidentialNewServiceTiers(
    tiers: {
      startingPoint: number
      finishingPoint: number
      price: number
      gmPrice: number
    }[],
  ) {
    this.props.residentialNewServiceTiers = tiers.map((tier) => {
      return new CustomResidentialNewServicePricingTier({
        startingPoint: tier.startingPoint,
        finishingPoint: tier.finishingPoint,
        price: tier.price,
        gmPrice: tier.gmPrice,
      })
    })
    return this
  }

  setResidentialRevisionPricing(pricing: { price: number; gmPrice: number } | null) {
    this.props.residentialRevisionPricing = pricing
      ? new CustomResidentialRevisionPricing({
          price: pricing.price,
          gmPrice: pricing.gmPrice,
        })
      : null
    return this
  }

  setCommercialNewServiceTiers(
    tiers: {
      startingPoint: number
      finishingPoint: number
      price: number
      gmPrice: number
    }[],
  ) {
    this.props.commercialNewServiceTiers = tiers.map((tier) => {
      return new CustomCommercialNewServicePricingTier({
        startingPoint: tier.startingPoint,
        finishingPoint: tier.finishingPoint,
        price: tier.price,
        gmPrice: tier.gmPrice,
      })
    })
    return this
  }

  setFixedPrice(price: number | null): this {
    this.props.fixedPricing = price ? new CustomFixedPrice({ value: price }) : null
    this.validate()
    return this
  }

  public validate(): void {
    if (this.props.fixedPricing) {
      this.props.commercialNewServiceTiers = []
      this.props.residentialNewServiceTiers = []
      this.props.residentialRevisionPricing = null
    }
    return
  }

  getPrice(
    isRevision: boolean,
    projectType: ProjectPropertyType,
    mountingType: MountingType,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevision | null,
  ): number | null {
    const pricing = this.getProps()
    let price = null

    if (this.getType() === CustomPricingType.custom_fixed && pricing.fixedPricing) {
      price = pricing.fixedPricing.value
    } else if (!isRevision && projectType === 'Residential') {
      const residentialFixedPrice = pricing.residentialNewServiceTiers.find((tier) => {
        return (
          (tier.startingPoint === 0 && tier.finishingPoint === null) ||
          (tier.startingPoint === 1 && tier.finishingPoint === null)
        )
      })

      if (!residentialFixedPrice || pricing.residentialNewServiceTiers.length > 1) return (price = null)

      price = mountingType === 'Ground Mount' ? residentialFixedPrice.gmPrice : residentialFixedPrice.price
    } else if (!isRevision && projectType === 'Commercial' && systemSize) {
      const commercialTier = pricing.commercialNewServiceTiers.find((tier) => {
        if (!systemSize) return
        return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
      })
      if (!commercialTier) return (price = null)
      price = mountingType === 'Ground Mount' ? commercialTier.gmPrice : commercialTier.price
    } else if (isRevision && projectType === 'Residential' && revisionSize) {
      if (!this.props.residentialRevisionPricing) {
        return (price = null)
      }
      if (revisionSize === 'Minor') price = 0
      if (revisionSize === 'Major') {
        price =
          mountingType === 'Ground Mount'
            ? this.props.residentialRevisionPricing.gmPrice
            : this.props.residentialRevisionPricing.price
      }
    } else if (isRevision) {
      price = null
    }

    return price
  }
}
