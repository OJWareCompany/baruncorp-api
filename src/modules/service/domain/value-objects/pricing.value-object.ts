import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { OrderedServiceSizeForRevisionEnum } from '../../../ordered-service/domain/ordered-service.type'
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

  calcPrice(
    isRevision: boolean,
    projectType: ProjectPropertyTypeEnum,
    mountingType: MountingTypeEnum,
    systemSize: number | null,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): number | null {
    if (this.fixedPrice) return this.fixedPrice
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
  ): number | null {
    if (projectType !== ProjectPropertyTypeEnum.Residential || !revisionSize) {
      return null
    }

    if (!this.props.standard || !this.props.standard.residential) {
      return null
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      return 0
    }

    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      return mountingType === MountingTypeEnum.Ground_Mount
        ? this.props.standard.residential.revisionGmPrice
        : this.props.standard.residential.revisionPrice
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
    if (!this.props.standard || !this.props.standard.residential) {
      return null
    }

    return mountingType === MountingTypeEnum.Ground_Mount
      ? this.props.standard.residential.gmPrice
      : this.props.standard.residential.price
  }

  private calculateCommercialPrice(systemSize: number, mountingType: MountingTypeEnum) {
    const commercialTier = this.findCommercialTier(systemSize)
    if (!commercialTier) return null
    return mountingType === MountingTypeEnum.Ground_Mount ? commercialTier.gmPrice : commercialTier.price
  }

  private findCommercialTier(systemSize: number) {
    return this.props.standard?.commercial?.newServiceTiers.find((tier) => {
      return tier.startingPoint <= systemSize && tier.finishingPoint >= systemSize
    })
  }
}
