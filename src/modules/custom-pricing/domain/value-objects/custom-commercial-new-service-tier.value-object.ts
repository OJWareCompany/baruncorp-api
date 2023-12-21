import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface CustomCommercialNewServicePricingTierProps {
  startingPoint: number
  finishingPoint: number | null
  price: number
  gmPrice: number
}

export class CustomCommercialNewServicePricingTier extends ValueObject<CustomCommercialNewServicePricingTierProps> {
  get startingPoint(): number {
    return this.props.startingPoint
  }

  get finishingPoint(): number | null {
    return this.props.finishingPoint
  }

  get price(): number {
    return this.props.price
  }

  get gmPrice(): number {
    return this.props.gmPrice
  }

  protected validate(props: CustomCommercialNewServicePricingTierProps): void {
    return
  }
}
