import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateCustomPricingProps, CustomPricingProps } from './custom-pricing.type'
import { CustomFixedPrice } from './value-objects/custom-fixed-pricing.value-object'
import { CustomCommercialNewServicePricingTier } from './value-objects/custom-commercial-new-service-tier.value-object'
import { CustomResidentialRevisionPricing } from './value-objects/custom-residential-revision-pricing.value-object'
import { CustomResidentialNewServicePricingTier } from './value-objects/custom-residential-new-servier-tier.value-object'
import {
  CustomPricingTypeEnum,
  ResidentialNewServicePricingTypeEnum,
} from '../commands/create-custom-pricing/create-custom-pricing.command'
import {
  MountingType,
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../project/domain/project.type'
import {
  OrderedServiceSizeForRevision,
  OrderedServiceSizeForRevisionEnum,
} from '../../ordered-service/domain/ordered-service.type'

export class CustomPricingEntity extends AggregateRoot<CustomPricingProps> {
  protected _id: string

  static create(create: CreateCustomPricingProps) {
    const id = v4()
    const props: CustomPricingProps = {
      ...create,
    }
    return new CustomPricingEntity({ id, props })
  }

  get customPricingType(): CustomPricingTypeEnum {
    return this.props.fixedPricing ? CustomPricingTypeEnum.custom_fixed : CustomPricingTypeEnum.custom_standard
  }

  get residentialNewServicePricingType(): ResidentialNewServicePricingTypeEnum | null {
    const residentialFlatdPrice = this.residentialNewFlatPricing

    return residentialFlatdPrice
      ? ResidentialNewServicePricingTypeEnum.flat
      : this.props.residentialNewServiceTiers.length > 1
      ? ResidentialNewServicePricingTypeEnum.tiered
      : null
  }

  get residentialNewFlatPrice(): number | null {
    const isFlat = this.isResidentialNewServiceFlatPricing
    const price = this.residentialNewFlatPricing
    return isFlat && price ? price.price : null
  }
  get residentialNewFlatGmPrice(): number | null {
    const isFlat = this.isResidentialNewServiceFlatPricing
    const price = this.residentialNewFlatPricing
    return isFlat && price ? price.gmPrice : null
  }

  get isResidentialNewServiceFlatPricing(): boolean {
    return this.residentialNewServicePricingType === ResidentialNewServicePricingTypeEnum.flat
  }

  private get residentialNewFlatPricing() {
    return this.props.residentialNewServiceTiers.find((tier) => {
      return (
        (tier.startingPoint === 0 && tier.finishingPoint === null) ||
        (tier.startingPoint === 1 && tier.finishingPoint === null)
      )
    })
  }

  // residentialNewServiceTiers: CustomResidentialNewServicePricingTier[]
  // residentialRevisionPricing: CustomResidentialRevisionPricing | null
  // commercialNewServiceTiers: CustomCommercialNewServicePricingTier[]
  // fixedPricing: CustomFixedPrice | null
  get hasNewResidentialPricing() {
    return !!this.props.residentialNewServiceTiers.length
  }

  get hasRevisionResidentialPricing() {
    return !!this.props.residentialRevisionPricing
  }

  get hasNewCommercialPricing() {
    return !!this.props.commercialNewServiceTiers.length
  }

  get hasFixedPricing() {
    return !!this.props.fixedPricing
  }

  get residentialNewServiceTiers() {
    return this.isResidentialNewServiceFlatPricing ? [] : this.props.residentialNewServiceTiers
  }

  setResidentialNewServiceTiers(
    tiers: {
      startingPoint: number
      finishingPoint: number
      price: number
      gmPrice: number
    }[],
  ) {
    this.props.residentialNewServiceTiers = tiers.map((tier) => new CustomResidentialNewServicePricingTier(tier))
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
    this.props.commercialNewServiceTiers = tiers.map((tier) => new CustomCommercialNewServicePricingTier(tier))
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

  calcPrice(
    isRevision: boolean,
    projectType: ProjectPropertyType,
    mountingType: MountingType,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevision | null,
  ): number | null {
    const pricing = this.getProps()
    let price = null

    if (this.customPricingType === CustomPricingTypeEnum.custom_fixed && pricing.fixedPricing) {
      // 고정가격
      price = pricing.fixedPricing.value
    } else if (!isRevision && projectType === ProjectPropertyTypeEnum.Residential) {
      // New Residential Service 고정가격
      const residentialFlatdPrice = pricing.residentialNewServiceTiers.find((tier) => {
        return (
          (tier.startingPoint === 0 && tier.finishingPoint === null) ||
          (tier.startingPoint === 1 && tier.finishingPoint === null)
        )
      })

      // New Residential Service Tiered 적용 예정
      if (!residentialFlatdPrice || pricing.residentialNewServiceTiers.length > 1) return (price = null)

      price =
        mountingType === MountingTypeEnum.Ground_Mount ? residentialFlatdPrice.gmPrice : residentialFlatdPrice.price
    } else if (!isRevision && projectType === ProjectPropertyTypeEnum.Commercial && systemSize) {
      // New Commercial Service 가격
      const commercialTier = pricing.commercialNewServiceTiers.find((tier) => {
        if (!systemSize) return
        return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
      })
      if (!commercialTier) return (price = null)
      price = mountingType === MountingTypeEnum.Ground_Mount ? commercialTier.gmPrice : commercialTier.price
    } else if (isRevision && projectType === ProjectPropertyTypeEnum.Residential && revisionSize) {
      if (!this.props.residentialRevisionPricing) {
        return (price = null)
      }
      if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) price = 0
      if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
        price =
          mountingType === MountingTypeEnum.Ground_Mount
            ? this.props.residentialRevisionPricing.gmPrice
            : this.props.residentialRevisionPricing.price
      }
    } else if (isRevision) {
      price = null
    }

    return price
  }
}
