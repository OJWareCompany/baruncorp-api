import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface CustomResidentialNewServicePricingTierProps {
  startingPoint: number
  finishingPoint: number | null
  price: number
  gmPrice: number
}

export class CustomResidentialNewServicePricingTier extends ValueObject<CustomResidentialNewServicePricingTierProps> {
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

  protected validate(props: CustomResidentialNewServicePricingTierProps): void {
    return
  }
}
