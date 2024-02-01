import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { CalcPriceAndPricingReturnType } from '../../../custom-pricing/domain/custom-pricing.type'
import {
  OrderedServicePricingTypeEnum,
  OrderedServiceSizeForRevisionEnum,
} from '../../../ordered-service/domain/ordered-service.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { ServicePricingTypeEnum } from '../service.type'
import { FixedPrice } from './fixed-price.value-object'
import { StandardPricing } from './standard-pricing.value-object'

export interface PricingProps {
  type: ServicePricingTypeEnum
  standard: StandardPricing | null
  fixed: FixedPrice | null
}

export class Pricing extends ValueObject<PricingProps> {
  get type(): ServicePricingTypeEnum {
    return this.props.type
  }

  get standard(): StandardPricing | null {
    return this.props.standard
  }

  get fixedPrice(): number | null {
    return this.props.fixed ? this.props.fixed.value : null
  }

  protected validate(props: PricingProps): void {
    return
  }

  calcPriceAndPricingType(
    isRevision: boolean,
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): CalcPriceAndPricingReturnType {
    if (this.fixedPrice) {
      return {
        price: this.fixedPrice,
        pricingType: OrderedServicePricingTypeEnum.BASE_FIXED_PRICE,
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
      return this.calculateNonRevisionPrice(projectType, mountingType, systemSize)
    }
  }

  private calculateResidentialRevisionPrice(
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): CalcPriceAndPricingReturnType {
    if (projectType !== ProjectPropertyTypeEnum.Residential) {
      return {
        price: null,
        pricingType: OrderedServicePricingTypeEnum.NO_PRICING_TYPE,
      }
    }

    if (!this.props.standard || !this.props.standard.residential) {
      return {
        price: null,
        pricingType: OrderedServicePricingTypeEnum.NO_PRICING_TYPE,
      }
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
            price: this.props.standard.residential.revisionGmPrice,
            pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_REVISION_GM_PRICE,
          }
        : {
            price: this.props.standard.residential.revisionPrice,
            pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_NEW_PRICE,
          }
    }

    return mountingType === MountingTypeEnum.Ground_Mount
      ? {
          price: null,
          pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_REVISION_GM_PRICE,
        }
      : {
          price: null,
          pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_NEW_PRICE,
        }
  }

  private calculateNonRevisionPrice(
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
  ): CalcPriceAndPricingReturnType {
    if (projectType === ProjectPropertyTypeEnum.Residential) {
      return this.calculateResidentialPrice(mountingType)
    } else if (projectType === ProjectPropertyTypeEnum.Commercial && systemSize) {
      return this.calculateCommercialPrice(systemSize, mountingType)
    }
    return {
      price: null,
      pricingType: OrderedServicePricingTypeEnum.NO_PRICING_TYPE,
    }
  }

  private calculateResidentialPrice(mountingType: MountingTypeEnum): CalcPriceAndPricingReturnType {
    if (!this.props.standard || !this.props.standard.residential) {
      return {
        price: null,
        pricingType: OrderedServicePricingTypeEnum.NO_PRICING_TYPE,
      }
    }

    return mountingType === MountingTypeEnum.Ground_Mount
      ? {
          price: this.props.standard.residential.gmPrice,
          pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_GM_PRICE,
        }
      : {
          price: this.props.standard.residential.price,
          pricingType: OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_NEW_PRICE,
        }
  }

  private calculateCommercialPrice(systemSize: number, mountingType: MountingTypeEnum): CalcPriceAndPricingReturnType {
    const commercialTier = this.findCommercialTier(systemSize)
    if (!commercialTier) {
      return {
        price: null,
        pricingType: OrderedServicePricingTypeEnum.NO_PRICING_TYPE,
      }
    }
    return mountingType === MountingTypeEnum.Ground_Mount
      ? { price: commercialTier.gmPrice, pricingType: OrderedServicePricingTypeEnum.BASE_COMMERCIAL_GM_PRICE }
      : { price: commercialTier.price, pricingType: OrderedServicePricingTypeEnum.BASE_COMMERCIAL_NEW_PRICE }
  }

  private findCommercialTier(systemSize: number) {
    return this.props.standard?.commercial?.newServiceTiers.find((tier) => {
      return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
    })
  }
}
