import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateCustomPricingProps, CustomPricingProps } from './custom-pricing.type'
import { CustomFixedPrice } from './value-objects/custom-fixed-pricing.value-object'
import { CustomCommercialNewServicePricingTier } from './value-objects/custom-commercial-new-service-tier.value-object'
import { Pricing } from '../../service/domain/value-objects/pricing.value-object'
import { CustomResidentialRevisionPricing } from './value-objects/custom-residential-revision-pricing.value-object'
import { CustomResidentialNewServicePricingTier } from './value-objects/custom-residential-new-servier-tier.value-object'

export class CustomPricingEntity extends AggregateRoot<CustomPricingProps> {
  protected _id: string

  static create(create: CreateCustomPricingProps) {
    const id = v4()
    const props: CustomPricingProps = {
      ...create,
    }
    return new CustomPricingEntity({ id, props })
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
}
