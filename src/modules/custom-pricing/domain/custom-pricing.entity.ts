import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import {
  OrderedServicePricingTypeEnum,
  OrderedServiceSizeForRevisionEnum,
} from '../../ordered-service/domain/ordered-service.type'
import {
  CustomPricingTypeEnum,
  ResidentialNewServicePricingTypeEnum,
} from '../commands/create-custom-pricing/create-custom-pricing.command'
import { CalcPriceAndPricingReturnType, CreateCustomPricingProps, CustomPricingProps } from './custom-pricing.type'
import { CustomResidentialNewServicePricingTier } from './value-objects/custom-residential-new-servier-tier.value-object'
import { CustomCommercialNewServicePricingTier } from './value-objects/custom-commercial-new-service-tier.value-object'
import { CustomPricingInvalidPriceException } from './custom-pricing.error'
import { CustomResidentialRevisionPricing } from './value-objects/custom-residential-revision-pricing.value-object'
import { CustomFixedPrice } from './value-objects/custom-fixed-pricing.value-object'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { TieredPricingCalculator } from '../../ordered-service/domain/domain-services/tiered-pricing-calculator.domain-service'

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
      : !!this.props.residentialNewServiceTiers.length
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
    if (price <= 0) throw new CustomPricingInvalidPriceException('price', price)
    if (gmPrice <= 0) throw new CustomPricingInvalidPriceException('gmPrice', gmPrice)
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

  cleanResidentialNewServiceTiers() {
    this.props.residentialNewServiceTiers = []
    return this
  }

  setResidentialNewServiceTiers(
    tiers: {
      startingPoint: number
      finishingPoint: number | null
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
      finishingPoint: number | null
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

  async calcPriceAndPricingType(
    orderedService: OrderedServiceEntity,
    tieredPricingCalculator: TieredPricingCalculator,
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): Promise<CalcPriceAndPricingReturnType | null> {
    const pricing = this.getProps()
    const isRevision = orderedService.isRevision

    if (this.customPricingType === CustomPricingTypeEnum.custom_fixed && pricing.fixedPricing) {
      return {
        price: pricing.fixedPricing.value,
        pricingType: OrderedServicePricingTypeEnum.CUSTOM_FIXED_PRICE,
      }
    }

    if (isRevision && projectType === ProjectPropertyTypeEnum.Commercial) {
      return {
        price: null,
        pricingType:
          mountingType === MountingTypeEnum.Ground_Mount
            ? OrderedServicePricingTypeEnum.BASE_COMMERCIAL_REVISION_GM_PRICE
            : OrderedServicePricingTypeEnum.BASE_COMMERCIAL_REVISION_PRICE,
      }
    }

    if (isRevision && projectType === ProjectPropertyTypeEnum.Residential) {
      return this.calculateResidentialRevisionPrice(projectType, mountingType, revisionSize)
    } else {
      return await this.calculateNonRevisionPrice(
        orderedService,
        tieredPricingCalculator,
        projectType,
        mountingType,
        systemSize,
      )
    }
  }

  private calculateResidentialRevisionPrice(
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): CalcPriceAndPricingReturnType | null {
    if (projectType !== ProjectPropertyTypeEnum.Residential) return null // back to standard pricing

    if (!this.props.residentialRevisionPricing) {
      return null // back to standard pricing
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      return {
        price: 0,
        pricingType: OrderedServicePricingTypeEnum.BASE_MINOR_REVISION_FREE,
      }
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      return mountingType === MountingTypeEnum.Ground_Mount
        ? {
            price: this.props.residentialRevisionPricing.gmPrice,
            pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_GM_PRICE,
          }
        : {
            price: this.props.residentialRevisionPricing.price,
            pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_PRICE,
          }
    }

    return mountingType === MountingTypeEnum.Ground_Mount
      ? {
          price: null,
          pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_GM_PRICE,
        }
      : {
          price: null,
          pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_PRICE,
        }
  }

  private async calculateNonRevisionPrice(
    orderedService: OrderedServiceEntity,
    tieredPricingCalculator: TieredPricingCalculator,
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
  ): Promise<CalcPriceAndPricingReturnType | null> {
    if (projectType === ProjectPropertyTypeEnum.Residential) {
      return await this.calculateResidentialPrice(orderedService, mountingType, tieredPricingCalculator)
    } else if (projectType === ProjectPropertyTypeEnum.Commercial && systemSize) {
      return this.calculateCommercialPrice(systemSize, mountingType)
    }
    return null
  }

  private async calculateResidentialPrice(
    orderedService: OrderedServiceEntity,
    mountingType: MountingTypeEnum,
    tieredPricingCalculator: TieredPricingCalculator,
  ): Promise<CalcPriceAndPricingReturnType | null> {
    if (await tieredPricingCalculator.isTieredPricingScope(orderedService)) {
      return {
        price: await tieredPricingCalculator.calc(orderedService), // Auto Update Price When Invoice Is Created
        pricingType:
          mountingType === MountingTypeEnum.Ground_Mount
            ? OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_PRICE
            : OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_PRICE,
      }
    }
    if (this.residentialNewFlatPricing) {
      return mountingType === MountingTypeEnum.Ground_Mount
        ? {
            price: this.residentialNewFlatPricing.gmPrice,
            pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_FLAT_PRICE,
          }
        : {
            price: this.residentialNewFlatPricing.price,
            pricingType: OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_FLAT_PRICE,
          }
    }
    return null
  }

  private calculateCommercialPrice(
    systemSize: number,
    mountingType: MountingTypeEnum,
  ): CalcPriceAndPricingReturnType | null {
    const commercialTier = this.getProps().commercialNewServiceTiers.find((tier) => {
      if (!systemSize) return
      const isWithinStart = tier.startingPoint <= systemSize
      const isWithinEnd = !tier.finishingPoint || tier.finishingPoint >= systemSize
      return isWithinStart && isWithinEnd
    })
    if (!commercialTier) {
      return null // back to standard pricing
    }
    return mountingType === MountingTypeEnum.Ground_Mount
      ? { price: commercialTier.gmPrice, pricingType: OrderedServicePricingTypeEnum.CUSTOM_COMMERCIAL_GM_PRICE }
      : { price: commercialTier.price, pricingType: OrderedServicePricingTypeEnum.CUSTOM_COMMERCIAL_NEW_PRICE }
  }
}
