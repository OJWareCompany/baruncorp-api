import { ValueObject } from '../../../../libs/ddd/value-object.base'
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
}
