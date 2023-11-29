import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { OrderedServiceSizeForRevision } from '../../../ordered-service/domain/ordered-service.type'
import { ProjectPropertyType, MountingType } from '../../../project/domain/project.type'
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

  getPrice(
    isRevision: boolean,
    projectType: ProjectPropertyType,
    mountingType: MountingType,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevision | null,
  ): number | null {
    let price = null
    if (this.fixedPrice) {
      price = this.fixedPrice
    } else if (!isRevision && projectType === 'Residential') {
      if (!this.props.standard || !this.props.standard.residential) {
        return (price = null)
      }
      price =
        mountingType === 'Ground Mount'
          ? this.props.standard.residential.gmPrice
          : this.props.standard.residential.price
    } else if (!isRevision && projectType === 'Commercial' && systemSize) {
      const commercialTier = this.props.standard?.commercial?.newServiceTiers.find((tier) => {
        if (!systemSize) return
        return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
      })
      if (!commercialTier) return (price = null)
      price = mountingType === 'Ground Mount' ? commercialTier.gmPrice : commercialTier.price
    } else if (isRevision && projectType === 'Residential' && revisionSize) {
      if (!this.props.standard || !this.props.standard.residential) {
        return (price = null)
      }
      if (revisionSize === 'Minor') price = 0
      if (revisionSize === 'Major') {
        price =
          mountingType === 'Ground Mount'
            ? this.props.standard.residential.revisionGmPrice
            : this.props.standard.residential.revisionPrice
      }
    }

    return price
  }

  protected validate(props: PricingProps): void {
    return
  }
}
