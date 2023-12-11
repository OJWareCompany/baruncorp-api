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
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { OrderedServiceSizeForRevisionEnum } from '../../ordered-service/domain/ordered-service.type'
import { CustomPricingInvalidPriceException } from './custom-pricing.error'

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
      ? ResidentialNewServicePricingTypeEnum.tier
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

  get hasNewResidentialTieredPricing() {
    return !this.isResidentialNewServiceFlatPricing || this.props.residentialNewServiceTiers.length > 1
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

  setResidentialNewServiceFlatPrice(price: number, gmPrice: number) {
    if (price <= 0 || gmPrice <= 0) throw new CustomPricingInvalidPriceException()
    this.props.residentialNewServiceTiers = [
      new CustomResidentialNewServicePricingTier({
        startingPoint: 1,
        finishingPoint: null,
        price,
        gmPrice,
      }),
    ]
    return this
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

  getVolumeTieredPrice(numberOfServices: number) {
    return (
      this.props.residentialNewServiceTiers.find((tier) => {
        const isWithinStart = tier.startingPoint <= numberOfServices
        const isWithinEnd = !tier.finishingPoint || tier.finishingPoint >= numberOfServices
        return isWithinStart && isWithinEnd
      }) || null
    )
  }

  calcPrice(
    isRevision: boolean,
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): number | null {
    const pricing = this.getProps()

    if (this.customPricingType === CustomPricingTypeEnum.custom_fixed && pricing.fixedPricing) {
      return pricing.fixedPricing.value
    }

    if (isRevision) {
      return this.calculateResidentialRevisionPrice(projectType, mountingType, revisionSize)
    } else {
      return this.calculateNonRevisionPrice(projectType, mountingType, systemSize)
    }
  }

  private calculateResidentialRevisionPrice(
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ) {
    if (projectType !== ProjectPropertyTypeEnum.Residential || !revisionSize) {
      return null
    }

    if (!this.props.residentialRevisionPricing) {
      return null
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      return 0
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      return mountingType === MountingTypeEnum.Ground_Mount
        ? this.props.residentialRevisionPricing.gmPrice
        : this.props.residentialRevisionPricing.price
    }

    return null
  }

  private calculateNonRevisionPrice(
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
  ) {
    if (projectType === ProjectPropertyTypeEnum.Residential) {
      return this.calculateResidentialPrice(mountingType)
    } else if (projectType === ProjectPropertyTypeEnum.Commercial && systemSize) {
      return this.calculateCommercialPrice(systemSize, mountingType)
    }
    return null
  }

  private calculateResidentialPrice(mountingType: MountingTypeEnum) {
    if (!this.residentialNewFlatPricing || this.getProps().residentialNewServiceTiers.length > 1) return null

    return mountingType === MountingTypeEnum.Ground_Mount
      ? this.residentialNewFlatPricing.gmPrice
      : this.residentialNewFlatPricing.price
  }

  private calculateCommercialPrice(systemSize: number, mountingType: MountingTypeEnum) {
    const commercialTier = this.getProps().commercialNewServiceTiers.find((tier) => {
      if (!systemSize) return
      return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
    })
    if (!commercialTier) return null
    return mountingType === MountingTypeEnum.Ground_Mount ? commercialTier.gmPrice : commercialTier.price
  }
}
